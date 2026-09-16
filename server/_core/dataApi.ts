/**
 * Quick example (matches curl usage):
 *   await callDataApi("Youtube/search", {
 *     query: { gl: "US", hl: "en", q: "manus" },
 *   })
 */
import { ENV } from "./env";

const DATA_API_REQUEST_TIMEOUT_MS = 15_000;

export type DataApiCallOptions = {
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  pathParams?: Record<string, unknown>;
  formData?: Record<string, unknown>;
};

export async function callDataApi(
  apiId: string,
  options: DataApiCallOptions = {},
): Promise<unknown> {
  if (!ENV.forgeApiUrl) {
    throw new Error("BUILT_IN_FORGE_API_URL is not configured");
  }
  if (!ENV.forgeApiKey) {
    throw new Error("BUILT_IN_FORGE_API_KEY is not configured");
  }

  // Build the full URL by appending the service path to the base URL
  const baseUrl = ENV.forgeApiUrl.endsWith("/")
    ? ENV.forgeApiUrl
    : `${ENV.forgeApiUrl}/`;
  const fullUrl = new URL(
    "webdevtoken.v1.WebDevService/CallApi",
    baseUrl,
  ).toString();

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "connect-protocol-version": "1",
        authorization: `Bearer ${ENV.forgeApiKey}`,
      },
      body: JSON.stringify({
        apiId,
        query: options.query,
        body: options.body,
        path_params: options.pathParams,
        multipart_form_data: options.formData,
      }),
      signal: AbortSignal.timeout(DATA_API_REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "TimeoutError"
        ? `Data API request timed out after ${DATA_API_REQUEST_TIMEOUT_MS}ms`
        : `Data API network error: ${String(error)}`;
    throw new Error(message);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Data API request failed (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`,
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    throw new Error(`Data API returned invalid JSON: ${String(error)}`);
  }

  if (payload && typeof payload === "object" && "jsonData" in payload) {
    try {
      return JSON.parse((payload as Record<string, string>).jsonData ?? "{}");
    } catch {
      return (payload as Record<string, unknown>).jsonData;
    }
  }
  return payload;
}
