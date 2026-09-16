export type VoiceLifecycleState = "idle" | "preparing" | "listening" | "processing" | "complete" | "cancelled" | "interrupted" | "error";

export type VoiceLifecycleEvent = "prepare" | "ready" | "capture" | "complete" | "cancel" | "interrupt" | "fail" | "reset";

export function transitionVoiceLifecycle(state: VoiceLifecycleState, event: VoiceLifecycleEvent): VoiceLifecycleState {
  if (event === "reset") return "idle";
  if (event === "prepare" && state === "idle") return "preparing";
  if (event === "ready" && state === "preparing") return "listening";
  if (event === "capture" && state === "listening") return "processing";
  if (event === "complete" && state === "processing") return "complete";
  if (event === "cancel" && (state === "preparing" || state === "listening" || state === "processing")) return "cancelled";
  if (event === "interrupt" && state !== "idle" && state !== "complete") return "interrupted";
  if (event === "fail" && state !== "idle") return "error";
  return state;
}

export function getVoiceLifecycleMessage(state: VoiceLifecycleState, durationSeconds = 0): string {
  switch (state) {
    case "preparing": return "Preparing the microphone…";
    case "listening": return durationSeconds > 0 ? `Listening · ${durationSeconds}s` : "Listening… speak a phrase";
    case "processing": return "Processing your voice input…";
    case "complete": return "Voice input ready";
    case "cancelled": return "Voice input stopped";
    case "interrupted": return "Voice input interrupted — tap to try again";
    case "error": return "Voice input unavailable — check microphone access";
    default: return "Voice input ready when you are";
  }
}

export function getVoiceAccessibilityLabel(state: VoiceLifecycleState): string {
  if (state === "listening" || state === "preparing" || state === "processing") return "Stop voice input";
  if (state === "interrupted" || state === "error") return "Retry voice input";
  return "Start voice input";
}
