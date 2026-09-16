export interface MutableRequestId {
  current: number;
}

export function beginLatestRequest(requestId: MutableRequestId): number {
  requestId.current += 1;
  return requestId.current;
}

export function isLatestRequest(
  requestId: MutableRequestId,
  activeRequest: number,
): boolean {
  return requestId.current === activeRequest;
}

export function invalidateLatestRequest(requestId: MutableRequestId): void {
  requestId.current += 1;
}
