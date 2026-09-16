export function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { name?: unknown; code?: unknown };
  return candidate.name === "AbortError" || candidate.code === "ABORT_ERR";
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  if (error && typeof error === "object") {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

export function isLikelyOfflineError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  return /network|offline|timeout|timed out|connection|fetch failed/.test(
    message,
  );
}

export function createAbortError(): Error {
  const error = new Error("Operation aborted");
  error.name = "AbortError";
  return error;
}
