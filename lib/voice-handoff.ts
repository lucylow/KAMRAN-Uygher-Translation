export type VoiceHandoffState = "ready" | "preparing" | "capturing" | "processing" | "handoff" | "retry" | "blocked";

export function getVoiceHandoffMessage(state: VoiceHandoffState): string {
  switch (state) {
    case "preparing": return "Preparing microphone access…";
    case "capturing": return "Listening for your phrase…";
    case "processing": return "Recognizing your words…";
    case "handoff": return "Voice captured — ready to translate";
    case "retry": return "Voice capture stopped — tap to try again";
    case "blocked": return "Microphone access is unavailable";
    default: return "Voice input is ready";
  }
}

export function canStartVoiceCapture(readiness: "checking" | "ready" | "permission-required" | "unavailable"): boolean {
  return readiness === "ready";
}

export function shouldInvalidatePlayback(previousText: string, nextText: string, previousDirection: string, nextDirection: string): boolean {
  return previousText !== nextText || previousDirection !== nextDirection;
}
