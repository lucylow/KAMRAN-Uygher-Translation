import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const STORAGE_PRESIGN_TIMEOUT_MS = 15_000;
const STORAGE_UPLOAD_TIMEOUT_MS = 120_000;

describe("KAMRAN storage helpers", () => {
  beforeEach(() => {
    vi.stubEnv("BUILT_IN_FORGE_API_URL", "https://forge.example.test");
    vi.stubEnv("BUILT_IN_FORGE_API_KEY", "test-key");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("reports presign timeouts with a bounded error", async () => {
    const timeoutSignal = AbortSignal.abort(
      new DOMException("The operation timed out", "TimeoutError"),
    );
    const timeoutSpy = vi
      .spyOn(AbortSignal, "timeout")
      .mockReturnValue(timeoutSignal);
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new DOMException("The operation timed out", "TimeoutError"),
    );

    const { storagePut } = await import("../server/storage");

    await expect(storagePut("test.txt", "data", "text/plain")).rejects.toThrow(
      `Storage presign request timed out after ${STORAGE_PRESIGN_TIMEOUT_MS}ms`,
    );
    expect(timeoutSpy).toHaveBeenCalledWith(STORAGE_PRESIGN_TIMEOUT_MS);
  });

  it("rejects malformed presign responses", async () => {
    vi.spyOn(AbortSignal, "timeout").mockReturnValue(
      AbortSignal.timeout(1_000),
    );
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("not-json", { status: 200 }),
    );

    const { storagePut } = await import("../server/storage");

    await expect(storagePut("test.txt", "data", "text/plain")).rejects.toThrow(
      "Storage presign returned invalid JSON",
    );
  });

  it("reports S3 upload timeouts after a successful presign", async () => {
    const presignResponse = new Response(
      JSON.stringify({ url: "https://s3.example.test/upload" }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
    const uploadTimeoutSignal = AbortSignal.abort(
      new DOMException("The operation timed out", "TimeoutError"),
    );
    const timeoutSpy = vi
      .spyOn(AbortSignal, "timeout")
      .mockReturnValueOnce(AbortSignal.abort())
      .mockReturnValueOnce(uploadTimeoutSignal);
    vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(presignResponse)
      .mockRejectedValueOnce(
        new DOMException("The operation timed out", "TimeoutError"),
      );

    const { storagePut } = await import("../server/storage");

    await expect(storagePut("test.txt", "data", "text/plain")).rejects.toThrow(
      `Storage upload to S3 timed out after ${STORAGE_UPLOAD_TIMEOUT_MS}ms`,
    );
    expect(timeoutSpy).toHaveBeenNthCalledWith(2, STORAGE_UPLOAD_TIMEOUT_MS);
  });

  it("rejects malformed signed URL responses", async () => {
    vi.spyOn(AbortSignal, "timeout").mockReturnValue(
      AbortSignal.timeout(1_000),
    );
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ url: null }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const { storageGetSignedUrl } = await import("../server/storage");

    await expect(storageGetSignedUrl("test.txt")).rejects.toThrow(
      "Forge returned empty signed URL",
    );
  });
});
