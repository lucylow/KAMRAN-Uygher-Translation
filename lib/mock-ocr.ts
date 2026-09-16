import { createAbortError } from "./error-utils";

export type OCRConfidence = "high" | "medium" | "low";

export function getOCRConfidenceLabel(confidence: number): OCRConfidence {
  if (confidence >= 0.9) return "high";
  if (confidence >= 0.75) return "medium";
  return "low";
}

export interface OCRResult {
  text: string;
  confidence: number;
  engine: "KAMRAN OCR (mock)" | "KAMRAN OCR (fallback)";
  latencyMs: number;
  preprocessing: string[];
}

export function getMockOCRFallback(): OCRResult {
  return {
    text: "谢谢你的帮助",
    confidence: 0.82,
    engine: "KAMRAN OCR (fallback)",
    latencyMs: 0,
    preprocessing: [
      "Contrast normalized",
      "Arabic/Chinese script detection",
      "Demo text recovery",
    ],
  };
}

export function mockRecognizeText(signal?: AbortSignal): Promise<OCRResult> {
  const startedAt = Date.now();
  if (signal?.aborted) return Promise.reject(createAbortError());

  return new Promise((resolve, reject) => {
    const cleanup = () => signal?.removeEventListener("abort", abort);
    const timer = setTimeout(() => {
      cleanup();
      resolve({
        text: "谢谢你的帮助",
        confidence: 0.94,
        engine: "KAMRAN OCR (mock)",
        latencyMs: Date.now() - startedAt,
        preprocessing: [
          "Downsampled",
          "Contrast enhanced",
          "Arabic/Chinese script detection",
        ],
      });
    }, 1100);
    const abort = () => {
      clearTimeout(timer);
      cleanup();
      reject(createAbortError());
    };
    signal?.addEventListener("abort", abort, { once: true });
  });
}
