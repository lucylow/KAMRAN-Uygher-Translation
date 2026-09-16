import AsyncStorage from "@react-native-async-storage/async-storage";

export type StorageWriteResult = { ok: true } | { ok: false; error: unknown };
export type StorageReadResult<T> =
  | { ok: true; value: T }
  | { ok: false; value: T; error: unknown };

export async function readStoredJsonWithStatus<T>(
  key: string,
  parse: (value: string | null) => T,
  fallback: T,
): Promise<StorageReadResult<T>> {
  let stored: string | null = null;
  let readError: unknown;
  try {
    stored = await AsyncStorage.getItem(key);
  } catch (error) {
    readError = error;
  }

  try {
    return readError === undefined
      ? { ok: true, value: parse(stored) }
      : { ok: false, value: parse(null), error: readError };
  } catch (parseError) {
    try {
      return {
        ok: false,
        value: parse(null),
        error: readError ?? parseError,
      };
    } catch {
      // A parser should normally be total, but storage must never crash the UI.
      return {
        ok: false,
        value: fallback,
        error: readError ?? parseError,
      };
    }
  }
}

export async function readStoredJson<T>(
  key: string,
  parse: (value: string | null) => T,
  fallback: T,
): Promise<T> {
  const result = await readStoredJsonWithStatus(key, parse, fallback);
  return result.value;
}

export async function writeStoredJson<T>(
  key: string,
  value: T,
  serialize: (value: T) => string = JSON.stringify,
): Promise<StorageWriteResult> {
  try {
    await AsyncStorage.setItem(key, serialize(value));
    return { ok: true };
  } catch (error) {
    // Local persistence is best-effort; callers retain in-memory state and can
    // show a degraded-storage message when the device rejects a write.
    return { ok: false, error };
  }
}

export async function removeStoredValue(
  key: string,
): Promise<StorageWriteResult> {
  try {
    await AsyncStorage.removeItem(key);
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}
