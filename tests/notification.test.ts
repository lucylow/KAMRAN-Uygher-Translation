import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const NOTIFICATION_TIMEOUT_MS = 15_000;

describe("KAMRAN owner notifications", () => {
  beforeEach(() => {
    vi.stubEnv("BUILT_IN_FORGE_API_URL", "https://forge.example.test");
    vi.stubEnv("BUILT_IN_FORGE_API_KEY", "test-key");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns false promptly when the notification service times out", async () => {
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

    const { notifyOwner } = await import("../server/_core/notification");

    await expect(
      notifyOwner({ title: "Test", content: "Notification" }),
    ).resolves.toBe(false);
    expect(timeoutSpy).toHaveBeenCalledWith(NOTIFICATION_TIMEOUT_MS);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://forge.example.test/webdevtoken.v1.WebDevService/SendNotification",
      expect.objectContaining({ signal: timeoutSignal }),
    );
  });

  it("returns false when the notification service rejects the request", async () => {
    vi.spyOn(AbortSignal, "timeout").mockReturnValue(
      AbortSignal.timeout(1_000),
    );
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("unavailable", { status: 503, statusText: "Unavailable" }),
    );

    const { notifyOwner } = await import("../server/_core/notification");

    await expect(
      notifyOwner({ title: "Test", content: "Notification" }),
    ).resolves.toBe(false);
  });
});
