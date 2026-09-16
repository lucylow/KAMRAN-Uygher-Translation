import { describe, expect, it } from "vitest";

import { sortHistoryEntries } from "../lib/history-display";

describe("history display", () => {
  it("keeps an empty phrasebook empty instead of inventing sample rows", () => {
    expect(sortHistoryEntries([])).toEqual([]);
  });

  it("returns entries newest first without mutating the source array", () => {
    const entries = [
      { id: "older", createdAt: 10 },
      { id: "newer", createdAt: 20 },
    ];

    expect(sortHistoryEntries(entries).map((entry) => entry.id)).toEqual([
      "newer",
      "older",
    ]);
    expect(entries.map((entry) => entry.id)).toEqual(["older", "newer"]);
  });
});
