export type VoiceQuality = "clear" | "review" | "retry";

export interface VoiceQualityAssessment {
  quality: VoiceQuality;
  label: string;
  guidance: string;
}

export function assessVoiceQuality(confidence: number): VoiceQualityAssessment {
  if (confidence >= 0.9) return { quality: "clear", label: "Clear capture", guidance: "Ready to translate." };
  if (confidence >= 0.78) return { quality: "review", label: "Review recommended", guidance: "Check the recognized phrase before translating." };
  return { quality: "retry", label: "Low-confidence capture", guidance: "Try again in a quieter space and speak a little more slowly." };
}

export function getVoiceRetryLabel(quality: VoiceQuality): string {
  return quality === "retry" ? "Try again" : "Record again";
}
