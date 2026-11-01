import Aioli from "@biowasm/aioli";
import RRuntime from "./rRuntime";
import logger from "./logger";
import { detectIsBinaryFile } from "./detectDataType";
import { makeBinaryDataValue, makeTextDataValue } from './dataValue'
import { verifySha256Digest } from "./artifactIntegrity";
import {
  DEFAULT_CATALOG_PACKAGE,
  DEFAULT_CATALOG_PUBLIC_JWK,
  validateCatalogEntry,
  verifySignedCatalog,
} from "./catalogTrust";

const toolMap = new Map();
const blobMap = new Map();
const REGISTRY_URL = process.env.REGISTRY_URL;
const REPO_OWNER = process.env.REPO_OWNER;
const REGISTRY_USERNAME = process.env.REGISTRY_USERNAME;
const REGISTRY_PASSWORD = process.env.REGISTRY_PASSWORD;
const CATALOG_PACKAGE = process.env.BIOCHEF_CATALOG_PACKAGE || DEFAULT_CATALOG_PACKAGE;
const CATALOG_PUBLIC_JWK = process.env.BIOCHEF_CATALOG_PUBLIC_JWK || DEFAULT_CATALOG_PUBLIC_JWK;
const ALLOW_UNSIGNED_LOCAL_CATALOG =
  process.env.NODE_ENV === "development" &&
  process.env.BIOCHEF_ALLOW_UNSIGNED_LOCAL_CATALOG === "true";

const IS_GHCR = REGISTRY_URL?.includes("ghcr.io") || false;

function authorizationHeaders(authorization) {
  return authorization ? { Authorization: authorization } : {};
}

// TODO: use ID instead of tool name
export function getTool(toolName) {
  if (!toolMap.has(toolName)) {
    logger.error(`[toolUtils.getTool] Tool ${toolName} is not loaded.`)
    return;
  }

  return toolMap.get(toolName);
}

export function getToolParameters(toolName) {
  const tool = getTool(toolName);
  const parameters = {}
  tool.parameters.forEach((param) => {
    parameters[param.name] = param
  })

  return parameters
}

export function getAllTools() {
  return [...toolMap.values()];
}

export function getToolsByCategory() {
  const categorizedTools = {};

  toolMap.forEach((tool) => {
    const category = tool.category || 'Uncategorized';

    if (!categorizedTools[category]) {
      categorizedTools[category] = [];
    }

    categorizedTools[category].push(tool);
  });

  return categorizedTools;
}

async function getGHCRToken(repo) {
  try {
    const res = await fetch(
      `${REGISTRY_URL}/token?scope=repository:${REPO_OWNER}/${repo}:pull`,
      {
        headers: {
          Authorization: "Basic " + btoa(`${REGISTRY_USERNAME}:${REGISTRY_PASSWORD}`)
        }
      }
    );

    if (!res.ok) {
      const text = await res.text();
      logger.error(`GHCR error ${res.status}: ${text}`);
      return false
    }

    const data = await res.json();

    if (!data.token) {
      logger.error("getGHCRToken got no token in response");
      return false
    }

    return data.token;

  } catch (err) {
    logger.error(`getGHCRToken failed: ${err.message}`);
    return false
  }
}

async function getAuthorizationAndBaseUrl(repo) {
  if (IS_GHCR) {
    const token = await getGHCRToken(repo);
    return {
      authorization: `Bearer ${token}`,
      base_url: `${REGISTRY_URL}/v2/${REPO_OWNER}`,
    };
  } else {
    return {
      authorization: REGISTRY_USERNAME && REGISTRY_PASSWORD
        ? "Basic " + btoa(`${REGISTRY_USERNAME}:${REGISTRY_PASSWORD}`)
        : null,
      base_url: `${REGISTRY_URL}/v2`,
    };
  }
}

async function fetchManifest(base_url, repo, tag, authorization) {
  try {
    const res = await fetch(`${base_url}/${repo}/manifests/${tag}`, {
      headers: {
        Accept: "application/vnd.oci.image.manifest.v1+json",
        ...authorizationHeaders(authorization),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      logger.error(`Failed to fetch manifest (${res.status}): ${repo}:${tag}\n${text}`);
      return false
    }

    if (tag.startsWith("sha256:")) {
      const bytes = await res.arrayBuffer();
      await verifySha256Digest(bytes, tag, `${repo}/manifest`);
      return JSON.parse(new TextDecoder("utf-8").decode(bytes));
    }

    return await res.json();
  } catch (err) {
    logger.error(`fetchManifest failed: ${err.message}`);
    return false
  }
}

async function fetchBlob(base_url, repo, digest, authorization, accept) {
  const arrayBuffer = await fetchBlobBytes(base_url, repo, digest, authorization, accept);
  if (!arrayBuffer) return false;
  return JSON.parse(new TextDecoder("utf-8").decode(arrayBuffer));
}

async function fetchBlobBytes(base_url, repo, digest, authorization, accept) {
  try {
    const res = await fetch(`${base_url}/${repo}/blobs/${digest}`, {
      headers: {
        Accept: accept,
        ...authorizationHeaders(authorization),
      },
    });

    if (!res.ok) {
      const text = await res.text();

      logger.error(
        `fetchBlob failed for ${repo}@${digest} (${res.status} ${res.statusText})`,
        text
      );

      return false;
    }
    return await res.arrayBuffer();

  } catch (err) {
    logger.error(`fetchBlob network error for ${repo}@${digest}`, err);
    return false;
  }
}

function findLayer(manifest, mediaType, fileName) {
  const matchingLayers = manifest.layers?.filter(
    layer =>
      layer.mediaType === mediaType &&
      layer.annotations?.["org.opencontainers.image.title"] === fileName
  );
  return matchingLayers?.length === 1 ? matchingLayers[0] : null;
}

function digestFromReference(digestReference) {
  const digest = digestReference?.split("@").pop();
  if (!digest?.startsWith("sha256:")) {
    throw new Error(`Invalid immutable digest reference: ${digestReference}`);
  }
  return digest;
}

function isLoopbackRegistry(registryUrl) {
  try {
    const hostname = new URL(registryUrl).hostname;
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  } catch {
    return false;
  }
}

function requireLocalDevelopmentConfiguration() {
  if (!isLoopbackRegistry(REGISTRY_URL)) {
    throw new Error("Unsigned development catalogs require a loopback registry");
  }
  if (CATALOG_PACKAGE !== "biochef-dev-plugins-index") {
    throw new Error("Unsigned development catalogs require the dedicated development package");
  }
}

async function loadLocalToolIndex(base_url, authorization) {
  requireLocalDevelopmentConfiguration();

  const manifest = await fetchManifest(base_url, CATALOG_PACKAGE, "index", authorization);
  if (!manifest) return false;
  if (
    manifest.annotations?.["biochef.index.environment"] !== "development" ||
    manifest.annotations?.["biochef.index.signed"] !== "false"
  ) {
    logger.error("Unsigned development index annotations are missing or invalid");
    return false;
  }

  const indexLayer = findLayer(manifest, "application/json", "index.json");
  if (!indexLayer) {
    logger.error("Unsigned development index layer is missing");
    return false;
  }

  const indexJson = await fetchBlob(
    base_url,
    CATALOG_PACKAGE,
    indexLayer.digest,
    authorization,
    "application/json",
  );
  if (!indexJson || typeof indexJson !== "object" || Array.isArray(indexJson)) return false;

  const developmentTools = [];
  for (const [repo, plugin] of Object.entries(indexJson)) {
    if (!plugin || typeof plugin.name !== "string" || !plugin.name) {
      throw new Error(`Invalid unsigned development index entry for ${repo}`);
    }
    developmentTools.push({
      ...plugin,
      repo,
      localDevelopment: true,
    });
  }

  toolMap.clear();
  for (const bundle of developmentTools) {
    toolMap.set(bundle.name, bundle);
  }

  logger.warn("Loaded an unsigned catalog from the loopback development registry");
  return true;
}

export async function loadToolIndex() {
  const { authorization, base_url } = await getAuthorizationAndBaseUrl(CATALOG_PACKAGE);
  if (!base_url) return false

  if (ALLOW_UNSIGNED_LOCAL_CATALOG) {
    return loadLocalToolIndex(base_url, authorization);
  }

  const manifest = await fetchManifest(base_url, CATALOG_PACKAGE, "latest", authorization);
  if (!manifest) return false

  const catalogLayer = findLayer(manifest, "application/vnd.biochef.verified-catalog+json", "index.json");
  const signatureLayer = findLayer(manifest, "application/vnd.biochef.catalog-signature+json", "index.sig.json");
  if (!catalogLayer || !signatureLayer) {
    logger.error("Verified catalog or catalog signature layer is missing");
    return false;
  }

  const catalogBytes = await fetchBlobBytes(base_url, CATALOG_PACKAGE, catalogLayer.digest, authorization, "application/vnd.biochef.verified-catalog+json");
  const signatureDocument = await fetchBlob(base_url, CATALOG_PACKAGE, signatureLayer.digest, authorization, "application/vnd.biochef.catalog-signature+json");
  if (!catalogBytes || !signatureDocument) return false

  const catalog = await verifySignedCatalog(catalogBytes, signatureDocument, CATALOG_PUBLIC_JWK, REGISTRY_URL, REPO_OWNER);

  const verifiedTools = [];
  for (const [key, plugin] of Object.entries(catalog.packages)) {
    validateCatalogEntry(plugin);
    verifiedTools.push({
      ...plugin,
      repo: plugin.package || key,
      catalogEntry: plugin,
    });
  }

  // Replace the visible catalogue only after every entry has passed validation.
  toolMap.clear();
  for (const bundle of verifiedTools) {
    toolMap.set(bundle.name, bundle);
  }

  return true
}

export async function loadTool(toolName) {
  const bundleEntry = toolMap.get(toolName);
  if (!bundleEntry) {
    logger.error(`Trying to load tool ${toolName} that is not in the index`)
    return false
  }

  if (bundleEntry.parameters) return true; // already loaded

  const repo = bundleEntry.repo;
  const { authorization, base_url } = await getAuthorizationAndBaseUrl(repo);
  if (!base_url) return false;

  const localDevelopment =
    ALLOW_UNSIGNED_LOCAL_CATALOG && bundleEntry.localDevelopment === true;
  if (localDevelopment) {
    requireLocalDevelopmentConfiguration();
  } else {
    validateCatalogEntry(bundleEntry.catalogEntry || bundleEntry);
  }

  const manifestReference = localDevelopment
    ? "latest"
    : digestFromReference(bundleEntry.digest_reference);
  const manifest = await fetchManifest(base_url, repo, manifestReference, authorization);
  if (!manifest) return false;

  const bundleLayer = findLayer(manifest, "application/vnd.biochef.bundle+json", "bundle.json");

  if (!bundleLayer) {
    // false, not undefined: callers test `result == false`, so returning
    // undefined here reads as a successful load and the tool is used anyway.
    logger.error(`No bundle.json layer found for ${repo}`);
    return false;
  }

  const bundleBytes = await fetchBlobBytes(base_url, repo, bundleLayer.digest, authorization, "application/vnd.biochef.bundle+json");
  if (!bundleBytes) return false;
  await verifySha256Digest(
    bundleBytes,
    localDevelopment ? bundleLayer.digest : bundleEntry.evidence.bundle_json,
    `${repo}/bundle.json`,
  );
  var bundle = JSON.parse(new TextDecoder("utf-8").decode(bundleBytes));
  if (!bundle) return false

  if (localDevelopment) {
    if (bundle.name !== bundleEntry.name) {
      logger.error(`Loaded bundle does not match unsigned development index entry for ${repo}`);
      return false;
    }
  } else if (
    bundle.id !== bundleEntry.id ||
    bundle.name !== bundleEntry.name ||
    bundle.version !== bundleEntry.version ||
    !runtimeMatchesCatalog(bundle.runtime, bundleEntry.runtime)
  ) {
    logger.error(`Loaded bundle does not match verified catalog entry for ${repo}`);
    return false;
  }

  bundle = { ...bundleEntry, ...bundle }

  bundle.repo = repo;
  bundle.localDevelopment = localDevelopment;
  if (!localDevelopment) {
    bundle.catalogEntry = bundleEntry.catalogEntry;
  }
  toolMap.set(toolName, bundle);

  return true
}

// The digests the signed catalog vouches for, for whichever runtime the entry
// declares. An R entry has no wasm block, so comparing only wasm digests would
// read a property of undefined on every R operation.
function runtimeMatchesCatalog(bundleRuntime, catalogRuntime) {
  if (catalogRuntime?.r) {
    return (
      !bundleRuntime?.wasm &&
      ["webr_version", "library_digest", "metadata_digest", "script_digest"].every(
        (key) => bundleRuntime?.r?.[key] === catalogRuntime.r[key]
      )
    );
  }
  return (
    !bundleRuntime?.r &&
    bundleRuntime?.wasm?.wasm_digest === catalogRuntime?.wasm?.wasm_digest &&
    bundleRuntime?.wasm?.js_digest === catalogRuntime?.wasm?.js_digest &&
    bundleRuntime?.wasm?.data_digest === catalogRuntime?.wasm?.data_digest
  );
}

async function generateBlob(url, type, authorization, expectedDigest) {
  const cacheKey = `${url}|${expectedDigest}`;
  if (blobMap.has(cacheKey)) return blobMap.get(cacheKey);

  try {
    const res = await fetch(url, {
      headers: {
        Accept: type,
        ...authorizationHeaders(authorization),
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch blob: ${res.status} ${res.statusText}`);

    const arrayBuffer = await res.arrayBuffer();
    await verifySha256Digest(arrayBuffer, expectedDigest, url);
    const blob = new Blob([arrayBuffer], { type });
    const blobURL = URL.createObjectURL(blob);
    blobMap.set(cacheKey, blobURL);
    return blobURL;
  } catch (err) {
    console.error("Failed to load authenticated blob:", err);
    throw err;
  }
}

async function getToolBlobs(toolName) {
  const toolConfig = getTool(toolName)

  const { authorization, base_url } = await getAuthorizationAndBaseUrl(toolConfig.repo);

  const wasmUrl = `${base_url}/${toolConfig.repo}/blobs/${toolConfig.runtime.wasm.wasm_digest}`
  const jsUrl = `${base_url}/${toolConfig.repo}/blobs/${toolConfig.runtime.wasm.js_digest}`
  const wasmBlob = await generateBlob(wasmUrl, "application/wasm", authorization, toolConfig.runtime.wasm.wasm_digest)
  const jsBlob = await generateBlob(jsUrl, "application/javascript", authorization, toolConfig.runtime.wasm.js_digest)
  const runtimeFiles = { [`${toolConfig.bin}.wasm`]: wasmBlob };

  const dataDigest = toolConfig.runtime.wasm.data_digest;
  if (dataDigest !== undefined) {
    const dataUrl = `${base_url}/${toolConfig.repo}/blobs/${dataDigest}`;
    runtimeFiles[`${toolConfig.bin}.data`] = await generateBlob(dataUrl, "application/octet-stream", authorization, dataDigest);
  }

  return { scriptUrl: jsBlob, runtimeFiles };
}

/** An operation runs under webR when its bundle carries an `r` runtime block. */
export function isROperation(toolName) {
  return Boolean(getTool(toolName)?.runtime?.r)
}

async function fetchVerifiedBytes(base_url, repo, digest, authorization) {
  const bytes = await fetchBlobBytes(base_url, repo, digest, authorization, "application/octet-stream")
  if (!bytes) throw new Error(`Failed to fetch ${digest} for ${repo}`)
  await verifySha256Digest(bytes, digest, `${repo}@${digest}`)
  return new Uint8Array(bytes)
}

/**
 * Fetches what one R operation needs: the package library, its index, and the
 * script, each checked against the digest its bundle records.
 *
 * Unlike the wasm path these are not turned into object URLs. The library has
 * to be handed to webR as bytes so it can be inflated and mounted, and the
 * script has to be handed over as source.
 */
async function getRToolBlobs(toolName, { withLibrary = true } = {}) {
  const toolConfig = getTool(toolName)
  const { authorization, base_url } = await getAuthorizationAndBaseUrl(toolConfig.repo)
  const { library_digest, metadata_digest, script_digest } = toolConfig.runtime.r

  const [library, metadataBytes, scriptBytes] = await Promise.all([
    // Skipped when this library is already mounted. Every operation in a
    // recipe ships the same library, and each lives in its own registry repo,
    // so nothing below this would deduplicate the download.
    withLibrary ? fetchVerifiedBytes(base_url, toolConfig.repo, library_digest, authorization) : null,
    withLibrary ? fetchVerifiedBytes(base_url, toolConfig.repo, metadata_digest, authorization) : null,
    fetchVerifiedBytes(base_url, toolConfig.repo, script_digest, authorization),
  ])

  const decoder = new TextDecoder("utf-8")
  return {
    library,
    metadata: metadataBytes ? JSON.parse(decoder.decode(metadataBytes)) : null,
    script: decoder.decode(scriptBytes),
  }
}

async function aioliReadFileHelper(CLI, fileName) {
  const stat = await CLI.ls(fileName)

  if (!stat) {
    logger.warn(`[aioliReadFileHelper] File ${fileName} does not exist`)
    return
  }

  const buffer = await CLI.read({ path: fileName, length: stat.size })

  if (detectIsBinaryFile(buffer)) {
    return makeBinaryDataValue(buffer);
  }
  else {
    const text = new TextDecoder("utf-8").decode(buffer);
    return makeTextDataValue(text)
  }
}

/*
ToolInvocation = {
  toolName: string
  // Name of the tool to execute

  uniqueId: string
  // Unique identifier for this execution
  
  toolArguments: string[]
  // CLI arguments passed directly to the tool

  inputs: {
    [inputName]: {
      mode: "text" | "output"
      // "text"
      //   Direct literal DataValue provided as input
      //   value is a DataValue:
      //   {
      //     kind: "text" | "binary" | "reference",
      //     data: any
      //   }

      // "output"
      //   Input comes from a previous tool invocation output
      //   value is a tuple:
      //   [sourceToolUniqueId, sourceOutputName]

      value: DataValue | [string, string]
    }
  }
}
*/
export async function runTools(
  toolInvocations,
  onToolFinished = () => { },
) {
  logger.log("[runMultipleTools] Running invocations", toolInvocations);

  let outputs = {}
  let errors = {}

  // Each invocation gets an Aioli instance of its own, so a fresh Web Worker and
  // a fresh module: a tool runs as it would in a new process. Reusing one
  // module across the nodes that call the same tool ran main() again on the
  // state the first call left, and a build that exits its runtime cannot run
  // main() twice at all (#146). Files pass from one node to the next through
  // the outputs below, which are already held here, not through a worker's
  // file system. The downloaded runtime files are reused across invocations.
  const toolBlobs = {}

  // isROperation reads the bundle, which exists only once loadTool has run. An
  // unloaded tool would answer "not R", be treated as an aioli tool, and fail
  // dereferencing a wasm digest it has no bundle for. Checked before anything
  // runs, so the message names the real problem.
  for (const invocation of toolInvocations) {
    if (!getTool(invocation.toolName)?.runtime) {
      throw new Error(`Tool ${invocation.toolName} was not loaded before running`)
    }
  }

  // R operations share one webR, started on first use. Booting it and mounting
  // a package library cost far more than a tool's wasm, so unlike an aioli tool
  // it is not started afresh per invocation; each invocation still gets file
  // names of its own. Keyed by library digest, not by tool: every operation in
  // a recipe ships the same library.
  let R = null
  const rLibraries = new Map()
  const rScripts = new Map()
  async function loadROperation(toolName) {
    if (rScripts.has(toolName)) return rScripts.get(toolName)

    const { webr_version, library_digest } = getTool(toolName).runtime.r
    const alreadyMounted = rLibraries.has(library_digest)
    const { library, metadata, script } = await getRToolBlobs(toolName, { withLibrary: !alreadyMounted })

    if (!alreadyMounted) {
      const image = {
        mountPoint: `/lib-${rLibraries.size}`,
        data: library,
        metadata,
        webrVersion: webr_version,
      }
      if (!R) R = await RRuntime.create({ libraryImages: [image], webrVersion: webr_version })
      else await R.mountLibrary(image)
      rLibraries.set(library_digest, image.mountPoint)
    }

    rScripts.set(toolName, script)
    return script
  }

  try {
    for (const invocation of toolInvocations) {
      const isR = isROperation(invocation.toolName)
      const rScript = isR ? await loadROperation(invocation.toolName) : null
      let runtime = R
      if (!isR) {
        toolBlobs[invocation.toolName] ??= await getToolBlobs(invocation.toolName)
        const { scriptUrl, runtimeFiles } = toolBlobs[invocation.toolName]
        runtime = await new Aioli([{
          tool: invocation.toolName,
          scriptUrl,
          runtimeFiles,
          loading: "lazy",
        }], {
          printInterleaved: false,
          debug: false,
        });
      }

      try {
        // 1. Prepare the inputs
        const toolDefinition = getTool(invocation.toolName)
        // Emscripten builds argv with stringToUTF8OnStack, which reads .length:
        // a number (an untouched recipe default) silently becomes "".
        let args = invocation.toolArguments.map(String)
        let lastArgs = [] // arguments that must appear after all flagged arguments.

        for (const inputDefinition of toolDefinition.io.inputs) {
          if (!invocation.inputs[inputDefinition.name]) continue
          const { mode, value } = invocation.inputs[inputDefinition.name];

          let inputFileName = undefined
          let stdinValue = undefined

          if (mode === "text") {
            if (inputDefinition.mode === "file") {
              inputFileName = `input-${invocation.uniqueId}-${inputDefinition.name}.txt`
              const fileContent = value.kind === "binary" ? new Blob([value.data]) : value.data;
              await runtime.mount({ name: inputFileName, data: fileContent })
            }
            else if (inputDefinition.mode === "stdin") {
              stdinValue = value.data
            }
          }
          else if (mode === "output") {
            const [source, sourceOutput] = value
            inputFileName = `${source}-${sourceOutput}.txt`
            const sourceValue = outputs[source]?.[sourceOutput] ?? makeTextDataValue("")

            if (inputDefinition.mode === "file") {
              const fileContent = sourceValue.kind === "binary" ? new Blob([sourceValue.data]) : sourceValue.data;
              await runtime.mount({ name: inputFileName, data: fileContent })
            }
            else if (inputDefinition.mode === "stdin") {
              stdinValue = sourceValue.data
            }
          }

          if (inputDefinition.mode === "file") {
            if (inputDefinition.flag) {
              args.push(inputDefinition.flag)
              args.push(inputFileName)
            }
            else {
              lastArgs.push(inputFileName)
            }
          }
          else if (inputDefinition.mode === "stdin") {
            runtime.stdin = stdinValue
          }
        };

        for (const outputDefinition of toolDefinition.io.outputs) {
          if (outputDefinition.mode !== "file" || outputDefinition.flag == undefined) continue

          const outputTarget = outputDefinition.filename ?? `${invocation.uniqueId}-${outputDefinition.name}.txt`

          if (outputDefinition.flag == "") {
            lastArgs.push(outputTarget)
          }
          else {
            args.push(outputDefinition.flag)
            args.push(outputTarget)
          }
        }
    
        args = [...args, ...lastArgs]

        // 2. Run the tool. An R operation is a script rather than a binary, so
        // it is the script source that is executed, with the same argument
        // vector the recipe's io and parameters produced.
        const { stdout, stderr } = await runtime.exec(isR ? rScript : invocation.toolName, args)
        errors[invocation.uniqueId] = [stderr]

        logger.log("[runMultipleTools]", invocation.toolName, {
          args,
          stdout,
          stderr,
        });
    
        // Artificial delay for testing purposes
        // const delay = 1000;
        // await new Promise(resolve => setTimeout(resolve, delay));

        // 3. Save the results; the invocations that use them mount them themselves
        for (const outputDefinition of toolDefinition.io.outputs) {
          let result

          if (outputDefinition.mode === "stdout") {
            result = makeTextDataValue(stdout)
          }
          else if (outputDefinition.mode === "file") {
            const fileToRead = outputDefinition.filename ?? `${invocation.uniqueId}-${outputDefinition.name}.txt`

            result = await aioliReadFileHelper(runtime, fileToRead)
            if (!result) {
              // TODO maybe have a proper way to handle this
              result = makeTextDataValue("")
              errors[invocation.uniqueId].push(`Output "${outputDefinition.name}" did not produce the expected file "${fileToRead}"`)
            }
          }

          outputs[invocation.uniqueId] ??= {};
          outputs[invocation.uniqueId][outputDefinition.name] = result;
        }

      } finally {
        // The worker holds the module and its heap; nothing reads it after this.
        // webR is kept for the next R operation and closed after the run.
        if (!isR) {
          try {
            await runtime.close()
          } catch (err) {
            logger.warn("[runMultipleTools] Failed to close the Aioli worker", err)
          }
        }
      }

      // call the callback function after invocation is done
      onToolFinished(invocation.uniqueId, outputs[invocation.uniqueId], errors[invocation.uniqueId])
    }
  } finally {
    if (R) {
      try {
        await R.close()
      } catch (err) {
        logger.warn("[runMultipleTools] Failed to close webR", err)
      }
    }
  }

  logger.log("[runMultipleTools] Results", outputs, errors);

  return { "outputs": outputs, "errors": errors }
}

export function getToolInputByName(toolName, inputName) {
  const tool = getTool(toolName)
  if (!tool) return null

  return getTool(toolName)?.io?.inputs?.find(i => i.name == inputName)?.types || null;
}

export function getToolOutputByName(toolName, outputName) {
  const tool = getTool(toolName)
  if (!tool) return null

  return getTool(toolName)?.io?.outputs?.find(o => o.name == outputName)?.types || null;
}

export function toolHasNoInputs(toolName) {
  const tool = getTool(toolName);
  if (!tool) return true;

  return !tool.io?.inputs || tool.io.inputs.length === 0;
}

export function getToolRuntimes(toolName) {
  const tool = getTool(toolName);
  if (!tool) return;

  return tool.runtime?.modes
}