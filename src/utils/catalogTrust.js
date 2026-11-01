import { sha256Hex } from "./artifactIntegrity.js";

const CATALOG_SCHEMA = "biochef.verified-catalog.v1";
const SIGNATURE_SCHEMA = "biochef.catalog-signature.v1";
const CATALOG_MEDIA_TYPE = "application/vnd.biochef.verified-catalog+json";
const CATALOG_SEQUENCE_PREFIX = "biochef.catalog.sequence";

export const DEFAULT_CATALOG_PACKAGE = "biochef-plugins-index";
export const DEFAULT_CATALOG_PUBLIC_JWK = JSON.stringify({
  alg: "ES256",
  crv: "P-256",
  kid: "biochef-catalog-key",
  kty: "EC",
  use: "sig",
  x: "96FNjTbbBMsn0LpaFDTJFToaxfBsCZcCTKkEjNJi_js",
  y: "mwG_hO5F6omiyrCD73nj4A4JCnaGheVHj9PuxpGHdf4",
});

function base64UrlToBytes(value) {
  const padded = value + "=".repeat((4 - value.length % 4) % 4);
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function parsePublicJwk(publicJwkJson) {
  if (!publicJwkJson) {
    throw new Error("Catalog public key is not configured");
  }

  const jwk = JSON.parse(publicJwkJson);
  if (jwk.kty !== "EC" || jwk.crv !== "P-256" || jwk.alg !== "ES256") {
    throw new Error("Catalog public key must be an ES256 P-256 JWK");
  }
  if (!jwk.kid || !jwk.x || !jwk.y) {
    throw new Error("Catalog public key is missing kid/x/y");
  }
  return jwk;
}

async function importCatalogKey(jwk) {
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["verify"],
  );
}

function normaliseRegistry(value) {
  return String(value || "")
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "")
    .toLowerCase();
}

function expectedRegistryNamespace(registryUrl, repoOwner) {
  const registry = normaliseRegistry(registryUrl);
  if (registry.includes("ghcr.io")) {
    return `${registry}/${String(repoOwner || "").toLowerCase()}`;
  }
  return registry;
}

function requireCatalog(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function checkCatalogRollback(catalog) {
  if (typeof localStorage === "undefined") return;

  const key = `${CATALOG_SEQUENCE_PREFIX}.${catalog.registry}.${catalog.package_prefix}.${catalog.channel}`;
  const previous = Number(localStorage.getItem(key) || "0");
  const current = Number(catalog.sequence);
  requireCatalog(Number.isSafeInteger(current) && current > 0, "Catalog sequence is invalid");
  requireCatalog(current >= previous, "Catalog sequence rollback detected");
  localStorage.setItem(key, String(current));
}

export async function verifySignedCatalog(catalogBytes, signatureDocument, publicJwkJson, expectedRegistryUrl, repoOwner) {
  requireCatalog(signatureDocument?.schema === SIGNATURE_SCHEMA, "Catalog signature schema is invalid");
  requireCatalog(signatureDocument.alg === "ES256", "Catalog signature algorithm is not supported");
  requireCatalog(signatureDocument.signed_media_type === CATALOG_MEDIA_TYPE, "Catalog signed media type is invalid");
  requireCatalog(typeof signatureDocument.signature === "string", "Catalog signature is missing");
  requireCatalog(typeof signatureDocument.signed_digest === "string", "Catalog signed digest is missing");

  const actualDigest = `sha256:${await sha256Hex(catalogBytes)}`;
  requireCatalog(actualDigest === signatureDocument.signed_digest.toLowerCase(), "Catalog bytes do not match the signed digest");

  const publicJwk = parsePublicJwk(publicJwkJson);
  requireCatalog(publicJwk.kid === signatureDocument.keyid, "Catalog signature key id does not match pinned key");

  const key = await importCatalogKey(publicJwk);
  const valid = await crypto.subtle.verify(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    base64UrlToBytes(signatureDocument.signature),
    catalogBytes,
  );
  requireCatalog(valid, "Catalog signature verification failed");

  const catalogText = new TextDecoder("utf-8").decode(catalogBytes);
  const catalog = JSON.parse(catalogText);
  validateCatalog(catalog, expectedRegistryUrl, repoOwner);
  return catalog;
}

export function validateCatalog(catalog, expectedRegistryUrl, repoOwner) {
  requireCatalog(catalog?.schema === CATALOG_SCHEMA, "Catalog schema is not supported");
  requireCatalog(catalog.channel, "Catalog channel is missing");
  requireCatalog(catalog.version, "Catalog version is missing");
  requireCatalog(normaliseRegistry(catalog.registry) === expectedRegistryNamespace(expectedRegistryUrl, repoOwner), "Catalog registry does not match configured registry");
  requireCatalog(catalog.packages && typeof catalog.packages === "object", "Catalog packages are missing");
  for (const entry of Object.values(catalog.packages)) {
    validateCatalogEntry(entry);
  }
  checkCatalogRollback(catalog);
}

export function validateCatalogEntry(entry) {
  requireCatalog(typeof entry?.id === "string" && entry.id, "Tool operation id is missing");
  requireCatalog(typeof entry?.name === "string" && entry.name, "Tool name is missing");
  requireCatalog(entry?.verification?.status === "passed", "Tool catalog entry is not verified");
  requireCatalog(entry.verification.cosign_signature === "passed", "Tool signature verification did not pass");
  requireCatalog(entry.verification.cyclonedx_attestation === "passed", "Tool CycloneDX attestation verification did not pass");
  requireCatalog(entry.verification.slsa_provenance === "passed", "Tool SLSA provenance verification did not pass");
  requireCatalog(typeof entry.digest_reference === "string" && entry.digest_reference.includes("@sha256:"), "Tool digest reference is not immutable");
  requireCatalog(entry.package, "Tool package is missing");
  requireCatalog(entry.version, "Tool version is missing");
  requireCatalog(entry.evidence?.bundle_json, "Tool bundle evidence digest is missing");
  if (entry.runtime?.r) {
    // An R operation runs a script against a package library under webR, so it
    // carries those digests in place of a wasm binary's.
    requireCatalog(!entry.runtime.wasm, "Tool declares both a WASM and an R runtime");
    requireCatalog(
      typeof entry.runtime.r.webr_version === "string" && /^\d+\.\d+\.\d+$/.test(entry.runtime.r.webr_version),
      "Tool webR version is invalid",
    );
    for (const key of ["library_digest", "metadata_digest", "script_digest"]) {
      requireCatalog(isSha256Digest(entry.runtime.r[key]), `Tool R ${key.replace("_", " ")} is invalid`);
    }
    return;
  }
  requireCatalog(entry.runtime?.wasm?.wasm_digest, "Tool WASM digest is missing");
  requireCatalog(entry.runtime?.wasm?.js_digest, "Tool JS digest is missing");
  if ("data_digest" in entry.runtime.wasm) {
    requireCatalog(isSha256Digest(entry.runtime.wasm.data_digest), "Tool data digest is invalid");
  }
}

function isSha256Digest(value) {
  return typeof value === "string" && /^sha256:[a-fA-F0-9]{64}$/.test(value);
}
