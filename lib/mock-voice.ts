import type { TranslationDirection } from "@/lib/mock-translation";
import { createAbortError } from "./error-utils";

export type VoiceEngineId = "system-mock-stt";
export type VoiceCaptureState =
  | "idle"
  | "listening"
  | "processing"
  | "complete"
  | "cancelled";

export interface VoiceEngineConfig {
  id: VoiceEngineId;
  name: string;
  supportsUyghur: boolean;
  supportsChinese: boolean;
  offlineSupported: boolean;
  requiresMicrophonePermission: boolean;
}

export interface VoiceCaptureResult {
  text: string;
  engine: VoiceEngineId;
  confidence: number;
  latencyMs: number;
  state: "complete";
  usedFallback?: boolean;
}

export const MOCK_VOICE_ENGINE: VoiceEngineConfig = {
  id: "system-mock-stt",
  name: "KAMRAN Voice (mock)",
  supportsUyghur: true,
  supportsChinese: true,
  offlineSupported: true,
  requiresMicrophonePermission: true,
};

export function getMockVoiceFallback(
  direction: TranslationDirection,
): VoiceCaptureResult {
  return {
    text: direction === "ug-zh" ? "ياخشىمۇسىز" : "你好",
    engine: MOCK_VOICE_ENGINE.id,
    confidence: 0.8,
    latencyMs: 0,
    state: "complete",
    usedFallback: true,
  };
}

export function mockCaptureVoice(
  direction: TranslationDirection,
  signal?: AbortSignal,
): Promise<VoiceCaptureResult> {
  const startedAt = Date.now();
  const text = direction === "ug-zh" ? "ياخشىمۇسىز" : "你好";
  if (signal?.aborted) return Promise.reject(createAbortError());

  return new Promise((resolve, reject) => {
    const cleanup = () => signal?.removeEventListener("abort", abort);
    const timer = setTimeout(() => {
      cleanup();
      resolve({
        text,
        engine: MOCK_VOICE_ENGINE.id,
        confidence: 0.93,
        latencyMs: Date.now() - startedAt,
        state: "complete",
        usedFallback: false,
      });
    }, 2200);
    const abort = () => {
      clearTimeout(timer);
      cleanup();
      reject(createAbortError());
    };
    signal?.addEventListener("abort", abort, { once: true });
  });
}
