export function sortHistoryEntries<T extends { createdAt: number }>(
  entries: T[],
): T[] {
  return [...entries].sort((left, right) => right.createdAt - left.createdAt);
}
