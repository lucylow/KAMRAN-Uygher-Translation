export type TranslationOrigin = "primary" | "fallback";

export function getTranslationOriginMessage(
  origin?: TranslationOrigin,
): string {
  return origin === "fallback"
    ? "Fallback result · Review before sharing"
    : "";
}
