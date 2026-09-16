import { createAbortError } from "./error-utils";

export type TranslationDirection = "ug-zh" | "zh-ug";

export interface MockTranslationResult {
  translatedText: string;
  confidence: number;
  engine: "KAMRAN AI (mock)" | "KAMRAN AI (fallback)";
  latencyMs: number;
}

const phrases: Record<TranslationDirection, Record<string, string>> = {
  "ug-zh": {
    ياخشىمۇسىز: "你好",
    رەھمەت: "谢谢",
    "قەيەردە ئولتۇرۇشقا بولىدۇ؟": "哪里可以坐？",
    "بۇ قانچە پۇل؟": "这个多少钱？",
  },
  "zh-ug": {
    你好: "ياخشىمۇسىز",
    谢谢: "رەھمەت",
    "哪里可以坐？": "قەيەردە ئولتۇرۇشقا بولىدۇ؟",
    "这个多少钱؟": "بۇ قانچە پۇل؟",
  },
};

function waitForTranslation(signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) return Promise.reject(createAbortError());
  return new Promise((resolve, reject) => {
    const cleanup = () => signal?.removeEventListener("abort", abort);
    const timeout = setTimeout(() => {
      cleanup();
      resolve();
    }, 900);
    const abort = () => {
      clearTimeout(timeout);
      cleanup();
      reject(createAbortError());
    };
    signal?.addEventListener("abort", abort, { once: true });
  });
}

export function getMockTranslationFallback(
  text: string,
  direction: TranslationDirection,
): MockTranslationResult {
  const normalized = text.trim();
  const known = phrases[direction][normalized];
  return {
    translatedText:
      known ??
      (direction === "ug-zh"
        ? "你好，很高兴认识你"
        : "ياخشىمۇسىز، سىز بىلەن تونۇشقانلىقىمدىن خۇشالمەن"),
    confidence: known ? 0.94 : 0.86,
    engine: "KAMRAN AI (fallback)",
    latencyMs: 0,
  };
}

export async function mockTranslate(
  text: string,
  direction: TranslationDirection,
  signal?: AbortSignal,
): Promise<MockTranslationResult> {
  const startedAt = Date.now();
  await waitForTranslation(signal);
  const normalized = text.trim();
  const known = phrases[direction][normalized];
  const translatedText =
    known ??
    (direction === "ug-zh"
      ? "你好，很高兴认识你"
      : "ياخشىمۇسىز، سىز بىلەن تونۇشقانلىقىمدىن خۇشالمەن");
  return {
    translatedText,
    confidence: known ? 0.98 : 0.91,
    engine: "KAMRAN AI (mock)",
    latencyMs: Date.now() - startedAt,
  };
}
