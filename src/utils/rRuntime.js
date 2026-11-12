import { WebR } from "webr";
import logger from "./logger";

// Working directory for a run. R operations resolve input and output files
// relative to it, the same way aioli tools resolve them relative to /shared/data,
// so a recipe's io definitions mean the same thing under either runtime.
const WORK_DIR = "/biochef";

// Evaluated by captureR to run one operation. It is a fixed string: the script
// path and the argument vector are bound as R variables rather than
// interpolated, so nothing a recipe or a user supplies is ever parsed as code.
//
// It returns "" on success or the error message on failure. That indirection is
// necessary rather than stylistic. captureR either surfaces R errors as a
// JavaScript throw and discards everything the script printed, or keeps the
// streams and swallows errors entirely, depending on captureConditions. Neither
// is usable on its own: the first loses the diagnostics, the second reports a
// failed operation as a success. Capturing the streams and reporting failure
// through the return value gives both.
const RUN_OPERATION = `local({
  .biochef_error <- NULL
  tryCatch(
    source(.biochef_script, echo = FALSE, local = FALSE),
    error = function(e) .biochef_error <<- conditionMessage(e)
  )
  if (is.null(.biochef_error)) "" else .biochef_error
})`;

/**
 * Decompresses a filesystem image if it arrived gzipped.
 *
 * The hub builds these with compression on, which roughly halves them, and
 * blobs pulled from the registry arrive as raw bytes: no Content-Encoding is
 * applied, so nothing has unpacked them by the time they get here. Detected by
 * magic number rather than by filename, since the caller is handing over bytes.
 */
async function inflate(data) {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  if (bytes[0] !== 0x1f || bytes[1] !== 0x8b) return bytes;

  const stream = new Blob([bytes])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/**
 * Runs R operations under webR.
 *
 * The surface mirrors the parts of Aioli that toolUtils uses -- mount, exec, ls,
 * read, close -- so that dispatching an invocation to one runtime or the other
 * does not change the shape of the calling code. It is deliberately not a
 * drop-in replacement: webR owns a separate worker with its own filesystem, so
 * an R operation cannot see files an aioli tool wrote, and vice versa. Data
 * crosses between them as bytes, through the caller.
 */
export default class RRuntime {
  constructor(webR, shelter) {
    this.webR = webR;
    this.shelter = shelter;
    this.stdin = "";
  }

  /**
   * Boots webR and mounts the package libraries the operations need.
   *
   * `libraryImages` are Emscripten filesystem images produced by the hub's R
   * build, each an object of { data, metadata } URLs. They carry the compiled
   * R packages; without them only base R is available.
   */
  static async create({ libraryImages = [] } = {}) {
    const webR = new WebR({ interactive: false });
    await webR.init();

    try {
      await webR.FS.mkdir(WORK_DIR);
    } catch (err) {
      // Already present is fine; anything else is not.
      const existing = await webR.FS.analyzePath(WORK_DIR);
      if (!existing?.exists) throw err;
    }

    for (const image of libraryImages) {
      await webR.FS.mkdir(image.mountPoint);
      await webR.FS.mount(
        "WORKERFS",
        {
          packages: [
            { blob: new Blob([await inflate(image.data)]), metadata: image.metadata },
          ],
        },
        image.mountPoint
      );
      // R only searches libraries listed in .libPaths(), so mounting is not
      // enough on its own.
      await webR.evalRVoid(".libPaths(c(libpath, .libPaths()))", {
        env: { libpath: image.mountPoint },
      });

      // Mounting an image whose bytes R cannot read does not fail. The mount
      // succeeds, the directory is empty, and the first symptom is
      // "there is no package called 'x'" from whichever operation runs first,
      // which points at the recipe rather than at the image. Check here
      // instead, while there is still something useful to say.
      const mounted = await webR.evalRNumber("length(list.files(dir))", {
        env: { dir: image.mountPoint },
      });
      if (mounted === 0) {
        throw new Error(
          `R package library mounted at ${image.mountPoint} is empty; the filesystem image could not be read`
        );
      }
    }

    const shelter = await new webR.Shelter();
    const runtime = new RRuntime(webR, shelter);

    await webR.evalRVoid("setwd(dir)", { env: { dir: WORK_DIR } });

    return runtime;
  }

  /** Writes a file into the run's working directory. */
  async mount({ name, data }) {
    const path = `${WORK_DIR}/${name}`;
    const bytes =
      typeof data === "string"
        ? new TextEncoder().encode(data)
        : data instanceof Blob
          ? new Uint8Array(await data.arrayBuffer())
          : new Uint8Array(data);

    await this.webR.FS.writeFile(path, bytes);
    return path;
  }

  /** Stats a file, returning false when it is absent, as Aioli.ls does. */
  async ls(name) {
    const info = await this.webR.FS.analyzePath(`${WORK_DIR}/${name}`);
    if (!info?.exists) return false;

    const bytes = await this.webR.FS.readFile(`${WORK_DIR}/${name}`);
    return { size: bytes.length };
  }

  /** Reads a file back as bytes. */
  async read({ path }) {
    return await this.webR.FS.readFile(`${WORK_DIR}/${path}`);
  }

  /**
   * Runs one operation's R script with `args` exposed to it.
   *
   * The script reads its arguments from `argv`. Scripts should open with
   *
   *   argv <- if (exists("argv")) argv else commandArgs(trailingOnly = TRUE)
   *
   * so that the same file also runs under Rscript, which is what makes an
   * operation testable outside the browser.
   */
  async exec(scriptSource, args = []) {
    const scriptPath = `${WORK_DIR}/.operation.R`;
    await this.webR.FS.writeFile(
      scriptPath,
      new TextEncoder().encode(scriptSource)
    );

    const globalEnv = await this.webR.objs.globalEnv;
    await globalEnv.bind(".biochef_script", scriptPath);
    // Constructed as an R character vector rather than handed over as a plain
    // array. webR infers the R type from the JavaScript value, and an empty
    // array carries nothing to infer from: it raises "Cannot convert undefined
    // or null to object" inside the worker, which would make every operation
    // that takes no arguments fail to run at all.
    await globalEnv.bind("argv", await new this.webR.RCharacter(args.map(String)));
    await globalEnv.bind("stdin", this.stdin ?? "");

    const capture = await this.shelter.captureR(RUN_OPERATION, {
      withAutoprint: false,
      captureStreams: true,
      // See RUN_OPERATION: errors are reported through the return value so that
      // the streams survive them.
      captureConditions: false,
    });

    let stdout = "";
    let stderr = "";
    for (const line of capture.output) {
      if (line.type === "stdout") stdout += `${line.data}\n`;
      else stderr += `${line.data}\n`;
    }

    const failure = await capture.result.toString();
    await this.shelter.purge();

    if (failure) {
      // Surfaced as stderr rather than thrown, so that a failing R operation
      // behaves like a failing command line tool: the pipeline records the
      // error against the invocation and keeps whatever was produced.
      stderr += `${failure}\n`;
      logger.warn("[RRuntime.exec] R operation failed", failure);
    }

    return { stdout, stderr };
  }

  async close() {
    try {
      await this.shelter.purge();
    } catch (err) {
      logger.warn("[RRuntime.close] Failed to purge the R shelter", err);
    }
    await this.webR.close();
  }
}
