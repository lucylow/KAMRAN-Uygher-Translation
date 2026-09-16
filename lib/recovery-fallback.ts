import { isAbortError, isLikelyOfflineError } from "./error-utils";

export type RecoveryFallbackReason = "offline" | "service";

export interface RecoveryFallbackResult<T> {
  value: T;
  usedFallback: boolean;
  reason: RecoveryFallbackReason | null;
}

export async function withRecoveryFallback<T>(
  primary: () => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<RecoveryFallbackResult<T>> {
  try {
    return {
      value: await primary(),
      usedFallback: false,
      reason: null,
    };
  } catch (error) {
    if (isAbortError(error)) throw error;
    return {
      value: await fallback(),
      usedFallback: true,
      reason: isLikelyOfflineError(error) ? "offline" : "service",
    };
  }
}

export function getRecoveryFallbackMessage(
  feature: "translation" | "voice" | "ocr",
  reason: RecoveryFallbackReason,
): string {
  const mode = reason === "offline" ? "Offline fallback" : "Built-in demo fallback";
  const noun = feature === "voice" ? "voice input" : feature === "ocr" ? "OCR" : "translation";
  return `${mode} used for ${noun}. You can retry when the service is available.`;
}
