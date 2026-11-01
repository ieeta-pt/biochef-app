import { WebR } from "webr";
import logger from "./logger";

// Working directory for a run. R operations resolve input and output files
// relative to it, the same way aioli tools resolve them relative to /shared/data,
// so a recipe's io definitions mean the same thing under either runtime.
const WORK_DIR = "/biochef";

/**
 * Where the webR runtime is served from.
 *
 * Left unset, webR fetches around 20 MB of R.js, R.wasm and its support files
 * from https://webr.r-wasm.org at run time. Everything else the app executes is
 * addressed by a digest recorded in a recipe and served from our own registry,
 * so that would be the one component arriving from a third party, identified by
 * nothing, and the one whose availability nothing here controls. (The digest
 * addresses the blob; this code does not itself verify the bytes it receives
 * against it.) The build copies those
 * files alongside the app instead (see the CopyWebpackPlugin entry for
 * node_modules/webr/dist) and this points at them.
 *
 * __webpack_public_path__ is rewritten by webpack to wherever the bundle was
 * served from, which is what makes this work under the /Biochef/ prefix the
 * deployed site uses as well as at the root in development.
 *
 * Returns null outside a webpack bundle -- a script exercising this module
 * under Node -- so that webR falls back to its own default rather than to a
 * guessed path that would not resolve. Every browser build goes through
 * webpack, so the copied runtime is always what the app itself loads.
 */
function runtimeBaseUrl() {
  if (typeof __webpack_public_path__ !== "string" || !__webpack_public_path__) {
    return null;
  }

  const publicPath = __webpack_public_path__.endsWith("/")
    ? __webpack_public_path__
    : `${__webpack_public_path__}/`;

  return `${publicPath}webr/`;
}

// Evaluated by captureR to run one operation. It is a fixed string: the script
// path and the argument vector are bound as R variables rather than
// interpolated, so nothing a recipe or a user supplies is ever parsed as code.
//
// It returns a zero-length vector on success and the error message on failure --
// length rather than content, because stop() with no arguments gives an empty
// conditionMessage, so "" cannot also stand for success. That indirection is
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
  if (is.null(.biochef_error)) character(0) else as.character(.biochef_error)
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
  static async create({ libraryImages = [], webrVersion = null, baseUrl = null } = {}) {
    // The worker is spawned by the constructor, not by init(), so everything
    // from here on has to be able to close it again. Without that a failed
    // start leaks a worker, and the natural response -- pressing Run again --
    // leaks another.
    const resolvedBaseUrl = baseUrl ?? runtimeBaseUrl();
    const webR = new WebR({
      interactive: false,
      // Omitted rather than passed as null, which webR would take literally.
      ...(resolvedBaseUrl ? { baseUrl: resolvedBaseUrl } : {}),
    });

    try {
      // The packages in a library image are only loadable by the webR release
      // they were compiled against, and the recipe records which that was. A
      // mismatch otherwise surfaces as a load error inside the worker with
      // nothing to attribute it to, most likely after a routine dependency
      // bump here rather than any change to the recipe.
      if (webrVersion && webR.version !== webrVersion) {
        throw new Error(
          `R package library was built for webR ${webrVersion}, but this build runs webR ${webR.version}`
        );
      }

      return await RRuntime.start(webR, libraryImages);
    } catch (err) {
      // try/catch rather than .catch(): close() returns undefined rather than a
      // promise when the worker never initialised, and calling .catch on that
      // throws a TypeError that replaces the error actually being reported.
      try {
        await webR.close();
      } catch (closeErr) {
        logger.warn("[RRuntime.create] Failed to close a webR worker after a failed start", closeErr);
      }
      throw err;
    }
  }

  static async start(webR, libraryImages) {
    await webR.init();

    try {
      await webR.FS.mkdir(WORK_DIR);
    } catch (err) {
      // Already present is fine; anything else is not.
      const existing = await webR.FS.analyzePath(WORK_DIR);
      if (!existing?.exists) throw err;
    }

    const shelter = await new webR.Shelter();
    const runtime = new RRuntime(webR, shelter);

    for (const image of libraryImages) {
      await runtime.mountLibrary(image);
    }

    await webR.evalRVoid("setwd(dir)", { env: { dir: WORK_DIR } });

    return runtime;
  }

  /**
   * Mounts a package library and puts it on the R library search path.
   *
   * Separate from create() because a run can involve more than one R operation,
   * each bringing its own library, and booting a second webR for the second
   * operation would mean paying for the runtime twice.
   */
  async mountLibrary({ mountPoint, data, metadata, webrVersion = null }) {
    // Checked here too, not only at create(): a run can involve two recipes,
    // and the second mounts into the session the first started. Without this
    // only the first library's version is ever verified.
    if (webrVersion && this.webR.version !== webrVersion) {
      throw new Error(
        `R package library was built for webR ${webrVersion}, but this build runs webR ${this.webR.version}`
      );
    }

    await this.webR.FS.mkdir(mountPoint);
    await this.webR.FS.mount(
      "WORKERFS",
      { packages: [{ blob: new Blob([await inflate(data)]), metadata }] },
      mountPoint
    );

    // R only searches libraries listed in .libPaths(), so mounting alone is not
    // enough.
    await this.webR.evalRVoid(".libPaths(c(libpath, .libPaths()))", {
      env: { libpath: mountPoint },
    });

    // Mounting an image whose bytes R cannot read does not fail. The mount
    // succeeds, the directory is empty, and the first symptom is
    // "there is no package called 'x'" from whichever operation runs first,
    // which points at the recipe rather than at the image. Check here instead,
    // while there is still something useful to say.
    const mounted = await this.webR.evalRNumber("length(list.files(dir))", {
      env: { dir: mountPoint },
    });
    if (mounted === 0) {
      throw new Error(
        `R package library mounted at ${mountPoint} is empty; the filesystem image could not be read`
      );
    }
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

    // Stat rather than read: read() follows immediately afterwards, and
    // reading here to report a length would copy every output across the
    // worker boundary twice.
    const size = await this.webR.evalRNumber("file.size(p)", {
      env: { p: `${WORK_DIR}/${name}` },
    });
    return { size };
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
    // Allocated from the shelter, not globally: an object created with
    // new webR.RCharacter belongs to the global shelter and would survive
    // purge(), leaking one vector per invocation. The empty case is built in R
    // rather than converted from an empty JS array, which webR cannot infer a
    // type from.
    const argv = args.length
      ? await this.shelter.evalR("as.character(x)", { env: { x: args.map(String) } })
      : await this.shelter.evalR("character(0)");
    await globalEnv.bind("argv", argv);
    await globalEnv.bind("stdin", this.stdin ?? "");

    let stdout = "";
    let stderr = "";
    let failure = null;

    try {
      const capture = await this.shelter.captureR(RUN_OPERATION, {
        withAutoprint: false,
        captureStreams: true,
        // See RUN_OPERATION: errors are reported through the return value so
        // that the streams survive them.
        captureConditions: false,
      });

      // webR reports one event per line with the terminator stripped, and does
      // so identically whether or not the output ended in one: cat("x\n") and
      // cat("x") both arrive as a single "x". The terminator cannot be
      // recovered, so one is appended per line, which reconstructs the
      // overwhelmingly common case of newline-terminated output and invents one
      // only for output that deliberately omitted it.
      for (const line of capture.output) {
        if (line.type === "stdout") stdout += `${line.data}\n`;
        else stderr += `${line.data}\n`;
      }

      // Read before the shelter is purged, which would invalidate it.
      const result = await capture.result.toJs();
      failure = result.values.length ? String(result.values[0] ?? "") : null;
    } finally {
      // Both belong here rather than on the success path. captureR can reject
      // outright -- a wasm trap is not an R condition -- and leaving stdin set
      // would deliver this operation's input to the next one, which never asked
      // for it, exactly as aioli's worker clears its buffer once drained.
      this.stdin = "";

      // Guarded, because the case where captureR rejected is also the case
      // where the worker may be in no state to purge. An exception thrown from
      // a finally replaces the one being propagated, which would hide the
      // failure that actually matters.
      try {
        await this.shelter.purge();
      } catch (purgeErr) {
        logger.warn("[RRuntime.exec] Failed to purge the R shelter", purgeErr);
      }
    }

    if (failure !== null) {
      // Surfaced as stderr rather than thrown, so that a failing R operation
      // behaves like a failing command line tool: the pipeline records the
      // error against the invocation and keeps whatever was produced.
      // stop() with no arguments gives an empty message, which would otherwise
      // add a bare newline and say nothing.
      stderr += `${failure || "the operation failed without reporting a reason"}\n`;
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
