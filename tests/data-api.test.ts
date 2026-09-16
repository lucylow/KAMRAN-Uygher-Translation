import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const DATA_API_TIMEOUT_MS = 15_000;

describe("KAMRAN Data API helper", () => {
  beforeEach(() => {
    vi.stubEnv("BUILT_IN_FORGE_API_URL", "https://forge.example.test");
    vi.stubEnv("BUILT_IN_FORGE_API_KEY", "test-key");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("reports external request timeouts with a bounded error", async () => {
    const timeoutSignal = AbortSignal.abort(
      new DOMException("The operation timed out", "TimeoutError"),
    );
    const timeoutSpy = vi
      .spyOn(AbortSignal, "timeout")
      .mockReturnValue(timeoutSignal);
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(
        new DOMException("The operation timed out", "TimeoutError"),
      );

    const { callDataApi } = await import("../server/_core/dataApi");

    await expect(callDataApi("Youtube/search")).rejects.toThrow(
      `Data API request timed out after ${DATA_API_TIMEOUT_MS}ms`,
    );
    expect(timeoutSpy).toHaveBeenCalledWith(DATA_API_TIMEOUT_MS);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://forge.example.test/webdevtoken.v1.WebDevService/CallApi",
      expect.objectContaining({ signal: timeoutSignal }),
    );
  });

  it("reports malformed successful responses instead of returning an empty object", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("not-json", {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const { callDataApi } = await import("../server/_core/dataApi");

    await expect(callDataApi("Youtube/search")).rejects.toThrow(
      "Data API returned invalid JSON",
    );
  });
});
