import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  readStoredJson,
  readStoredJsonWithStatus,
  removeStoredValue,
  writeStoredJson,
} from "../lib/async-storage-json";

const storage = vi.mocked(AsyncStorage);

describe("resilient JSON storage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns parsed values when storage contains valid data", async () => {
    storage.getItem.mockResolvedValue('{"enabled":true}');

    await expect(
      readStoredJson("settings", (stored) => JSON.parse(stored ?? "{}"), {
        enabled: false,
      }),
    ).resolves.toEqual({ enabled: true });
  });

  it("returns the caller fallback when a parser fails for both stored and empty input", async () => {
    storage.getItem.mockResolvedValue("corrupt");
    const fallback = { enabled: false };
    const parse = vi.fn(() => {
      throw new Error("invalid settings");
    });

    await expect(readStoredJson("settings", parse, fallback)).resolves.toBe(
      fallback,
    );
    expect(parse).toHaveBeenCalledTimes(2);
  });

  it("reports a storage read failure while preserving the parser fallback", async () => {
    storage.getItem.mockRejectedValue(new Error("read unavailable"));

    await expect(
      readStoredJsonWithStatus(
        "history",
        (stored) => JSON.parse(stored ?? "[]") as string[],
        [],
      ),
    ).resolves.toMatchObject({ ok: false, value: [] });
  });

  it("reports malformed persisted data as degraded while keeping the safe fallback", async () => {
    storage.getItem.mockResolvedValue("corrupt");

    await expect(
      readStoredJsonWithStatus(
        "history",
        (stored) => JSON.parse(stored ?? "[]") as string[],
        [],
      ),
    ).resolves.toMatchObject({ ok: false, value: [] });
  });

  it("contains storage write and remove failures as result values", async () => {
    storage.setItem.mockRejectedValue(new Error("write unavailable"));
    storage.removeItem.mockRejectedValue(new Error("remove unavailable"));

    await expect(
      writeStoredJson("settings", { enabled: true }),
    ).resolves.toMatchObject({
      ok: false,
    });
    await expect(removeStoredValue("settings")).resolves.toMatchObject({
      ok: false,
    });
  });
});
