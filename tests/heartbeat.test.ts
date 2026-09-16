import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const HEARTBEAT_TIMEOUT_MS = 15_000;

describe("KAMRAN heartbeat service", () => {
  beforeEach(() => {
    vi.stubEnv("BUILT_IN_FORGE_API_URL", "https://forge.example.test");
    vi.stubEnv("BUILT_IN_FORGE_API_KEY", "test-key");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("reports external request timeouts without waiting for the real timeout", async () => {
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

    const { createHeartbeatJob } = await import("../server/_core/heartbeat");

    await expect(
      createHeartbeatJob(
        {
          name: "test-job",
          cron: "0 * * * * *",
          path: "/api/scheduled/test",
        },
        "",
      ),
    ).rejects.toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      message: `Heartbeat CreateHeartbeatJob request timed out after ${HEARTBEAT_TIMEOUT_MS}ms`,
    });

    expect(timeoutSpy).toHaveBeenCalledWith(HEARTBEAT_TIMEOUT_MS);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://forge.example.test/webdevtoken.v1.WebDevService/CreateHeartbeatJob",
      expect.objectContaining({ signal: timeoutSignal }),
    );
  });

  it("normalizes malformed successful responses into an internal error", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("not-json", {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const { listHeartbeatJobs } = await import("../server/_core/heartbeat");

    await expect(listHeartbeatJobs("")).rejects.toMatchObject({
      code: "INTERNAL_SERVER_ERROR",
      message: expect.stringContaining(
        "Heartbeat ListHeartbeatJobs returned invalid JSON",
      ),
    });
  });
});
