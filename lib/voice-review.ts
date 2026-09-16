import type { VoiceQuality } from "./voice-quality";

export type VoiceReviewAction = "confirm" | "rerecord";

export function getVoiceReviewActionLabel(action: VoiceReviewAction, quality: VoiceQuality): string {
  if (action === "rerecord") return quality === "retry" ? "Try again" : "Rerecord";
  return quality === "clear" ? "Use recognized text" : "Confirm recognized text";
}

export function requiresVoiceReview(quality: VoiceQuality | null): boolean {
  return quality !== null && quality !== "clear";
}
