export type AsyncStatusTone = "info" | "success" | "error";
export type AsyncStatusAccessibilityRole = "alert" | "text";

export function getAsyncStatusAccessibilityRole(
  tone: AsyncStatusTone,
): AsyncStatusAccessibilityRole {
  return tone === "error" ? "alert" : "text";
}
