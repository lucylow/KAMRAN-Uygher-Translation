import type {
  MockTranslationResult,
  TranslationDirection,
} from "@/lib/mock-translation";

export function getTranslationDirectionLabel(
  direction: TranslationDirection,
): string {
  return direction === "ug-zh" ? "Uyghur → Chinese" : "Chinese → Uyghur";
}

export function formatTranslationResultStatus(
  response: MockTranslationResult,
): string {
  return `${response.engine} · ${response.latencyMs}ms · ${Math.round(response.confidence * 100)}% confidence`;
}
