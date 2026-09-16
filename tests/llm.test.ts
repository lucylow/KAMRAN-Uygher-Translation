import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const LLM_INVOKE_TIMEOUT_MS = 120_000;
const LLM_MODELS_TIMEOUT_MS = 15_000;

describe("KAMRAN LLM helper", () => {
  beforeEach(() => {
    vi.stubEnv("BUILT_IN_FORGE_API_URL", "https://forge.example.test");
    vi.stubEnv("BUILT_IN_FORGE_API_KEY", "test-key");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("reports completion timeouts without retrying indefinitely", async () => {
    const timeoutSignal = AbortSignal.abort(
      new DOMException("The operation timed out", "TimeoutError"),
    );
    const timeoutSpy = vi
      .spyOn(AbortSignal, "timeout")
      .mockReturnValue(timeoutSignal);
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new DOMException("The operation timed out", "TimeoutError"),
    );

    const { invokeLLM } = await import("../server/_core/llm");

    await expect(
      invokeLLM({ messages: [{ role: "user", content: "Hello" }] }),
    ).rejects.toThrow(`LLM request timed out after ${LLM_INVOKE_TIMEOUT_MS}ms`);
    expect(timeoutSpy).toHaveBeenCalledWith(LLM_INVOKE_TIMEOUT_MS);
  });

  it("normalizes malformed completion JSON", async () => {
    vi.spyOn(AbortSignal, "timeout").mockReturnValue(AbortSignal.abort());
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("not-json", { status: 200 }),
    );

    const { invokeLLM } = await import("../server/_core/llm");

    await expect(
      invokeLLM({ messages: [{ role: "user", content: "Hello" }] }),
    ).rejects.toThrow("LLM invoke returned invalid JSON");
  });

  it("rejects completion payloads without choices", async () => {
    vi.spyOn(AbortSignal, "timeout").mockReturnValue(AbortSignal.abort());
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "response" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const { invokeLLM } = await import("../server/_core/llm");

    await expect(
      invokeLLM({ messages: [{ role: "user", content: "Hello" }] }),
    ).rejects.toThrow("LLM invoke returned an invalid response payload");
  });

  it("rejects malformed model lists", async () => {
    const timeoutSpy = vi
      .spyOn(AbortSignal, "timeout")
      .mockReturnValue(AbortSignal.abort());
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: null }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const { listLLMModels } = await import("../server/_core/llm");

    await expect(listLLMModels()).rejects.toThrow(
      "List LLM models returned an invalid models payload",
    );
    expect(timeoutSpy).toHaveBeenCalledWith(LLM_MODELS_TIMEOUT_MS);
  });
});
