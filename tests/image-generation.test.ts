import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const IMAGE_GENERATION_TIMEOUT_MS = 60_000;
const IMAGE_MODELS_TIMEOUT_MS = 15_000;

describe("KAMRAN image generation service", () => {
  beforeEach(() => {
    vi.stubEnv("BUILT_IN_FORGE_API_URL", "https://forge.example.test");
    vi.stubEnv("BUILT_IN_FORGE_API_KEY", "test-key");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("reports image generation timeouts without waiting indefinitely", async () => {
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

    const { generateImage } = await import("../server/_core/imageGeneration");

    await expect(generateImage({ prompt: "A test image" })).rejects.toThrow(
      `Image generation request timed out after ${IMAGE_GENERATION_TIMEOUT_MS}ms`,
    );
    expect(timeoutSpy).toHaveBeenCalledWith(IMAGE_GENERATION_TIMEOUT_MS);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://forge.example.test/images.v1.ImageService/GenerateImage",
      expect.objectContaining({ signal: timeoutSignal }),
    );
  });

  it("rejects malformed successful image responses", async () => {
    vi.spyOn(AbortSignal, "timeout").mockReturnValue(
      AbortSignal.timeout(1_000),
    );
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("not-json", { status: 200 }),
    );

    const { generateImage } = await import("../server/_core/imageGeneration");

    await expect(generateImage({ prompt: "A test image" })).rejects.toThrow(
      "Image generation returned invalid JSON",
    );
  });

  it("rejects image responses without usable image data", async () => {
    vi.spyOn(AbortSignal, "timeout").mockReturnValue(
      AbortSignal.timeout(1_000),
    );
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ image: { b64Json: "", mimeType: "image/png" } }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    );

    const { generateImage } = await import("../server/_core/imageGeneration");

    await expect(generateImage({ prompt: "A test image" })).rejects.toThrow(
      "Image generation returned an invalid image payload",
    );
  });

  it("rejects malformed image model lists", async () => {
    const timeoutSpy = vi
      .spyOn(AbortSignal, "timeout")
      .mockReturnValue(AbortSignal.timeout(1_000));
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ models: null }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const { listImageModels } = await import("../server/_core/imageGeneration");

    await expect(listImageModels()).rejects.toThrow(
      "List image models returned an invalid models payload",
    );
    expect(timeoutSpy).toHaveBeenCalledWith(IMAGE_MODELS_TIMEOUT_MS);
  });
});
