// Preconfigured storage helpers for Manus WebDev templates
// Uploads via Forge Server presigned URL to S3 (PUT direct).
// Downloads return /manus-storage/{key} paths served via 307 redirect.

import { ENV } from "./_core/env";

const STORAGE_PRESIGN_TIMEOUT_MS = 15_000;
const STORAGE_UPLOAD_TIMEOUT_MS = 120_000;

async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number,
  operation: string,
): Promise<Response> {
  try {
    return await fetch(input, {
      ...init,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "TimeoutError"
        ? `${operation} timed out after ${timeoutMs}ms`
        : `${operation} network error: ${String(error)}`;
    throw new Error(message);
  }
}

function getForgeConfig() {
  const forgeUrl = ENV.forgeApiUrl;
  const forgeKey = ENV.forgeApiKey;

  if (!forgeUrl || !forgeKey) {
    throw new Error(
      "Storage config missing: set BUILT_IN_FORGE_API_URL and BUILT_IN_FORGE_API_KEY",
    );
  }

  return { forgeUrl: forgeUrl.replace(/\/+$/, ""), forgeKey };
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const { forgeUrl, forgeKey } = getForgeConfig();
  const key = appendHashSuffix(normalizeKey(relKey));

  // 1. Get presigned PUT URL from Forge
  const presignUrl = new URL("v1/storage/presign/put", forgeUrl + "/");
  presignUrl.searchParams.set("path", key);

  const presignResp = await fetchWithTimeout(
    presignUrl,
    { headers: { Authorization: `Bearer ${forgeKey}` } },
    STORAGE_PRESIGN_TIMEOUT_MS,
    "Storage presign request",
  );

  if (!presignResp.ok) {
    const msg = await presignResp.text().catch(() => presignResp.statusText);
    throw new Error(`Storage presign failed (${presignResp.status}): ${msg}`);
  }

  let presignPayload: { url?: string };
  try {
    presignPayload = (await presignResp.json()) as { url?: string };
  } catch (error) {
    throw new Error(`Storage presign returned invalid JSON: ${String(error)}`);
  }
  const s3Url = presignPayload.url;
  if (typeof s3Url !== "string" || s3Url.length === 0) {
    throw new Error("Forge returned empty presign URL");
  }

  // 2. PUT file directly to S3
  const blob =
    typeof data === "string"
      ? new Blob([data], { type: contentType })
      : new Blob([data as any], { type: contentType });

  const uploadResp = await fetchWithTimeout(
    s3Url,
    {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: blob,
    },
    STORAGE_UPLOAD_TIMEOUT_MS,
    "Storage upload to S3",
  );

  if (!uploadResp.ok) {
    throw new Error(`Storage upload to S3 failed (${uploadResp.status})`);
  }

  return { key, url: `/manus-storage/${key}` };
}

export async function storageGet(
  relKey: string,
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  return { key, url: `/manus-storage/${key}` };
}

export async function storageGetSignedUrl(relKey: string): Promise<string> {
  const { forgeUrl, forgeKey } = getForgeConfig();
  const key = normalizeKey(relKey);

  const getUrl = new URL("v1/storage/presign/get", forgeUrl + "/");
  getUrl.searchParams.set("path", key);

  const resp = await fetchWithTimeout(
    getUrl,
    { headers: { Authorization: `Bearer ${forgeKey}` } },
    STORAGE_PRESIGN_TIMEOUT_MS,
    "Storage signed URL request",
  );

  if (!resp.ok) {
    const msg = await resp.text().catch(() => resp.statusText);
    throw new Error(`Storage signed URL failed (${resp.status}): ${msg}`);
  }

  let signedUrlPayload: { url?: string };
  try {
    signedUrlPayload = (await resp.json()) as { url?: string };
  } catch (error) {
    throw new Error(
      `Storage signed URL returned invalid JSON: ${String(error)}`,
    );
  }
  if (
    typeof signedUrlPayload.url !== "string" ||
    signedUrlPayload.url.length === 0
  ) {
    throw new Error("Forge returned empty signed URL");
  }
  return signedUrlPayload.url;
}
