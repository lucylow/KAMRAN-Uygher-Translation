/**
 * Image generation helper using internal ImageService
 *
 * Example usage:
 *   const { url: imageUrl } = await generateImage({
 *     prompt: "A serene landscape with mountains"
 *   });
 *
 * For editing:
 *   const { url: imageUrl } = await generateImage({
 *     prompt: "Add a rainbow to this landscape",
 *     originalImages: [{
 *       url: "https://example.com/original.jpg",
 *       mimeType: "image/jpeg"
 *     }]
 *   });
 */
import { storagePut } from "../storage";
import { ENV } from "./env";

// Default model for generated sites. "MODEL_GPT_IMAGE_2" is the forge images.v1
// enum for GPT Image 2 (id: gpt-image-2). If omitted, forge falls back to Gemini 2.5 Flash.
const DEFAULT_IMAGE_MODEL = "MODEL_GPT_IMAGE_2";
const DEFAULT_IMAGE_QUALITY = "medium";
const IMAGE_GENERATION_TIMEOUT_MS = 60_000;
const IMAGE_MODELS_TIMEOUT_MS = 15_000;

export type GenerateImageOptions = {
  prompt: string;
  originalImages?: Array<{
    url?: string;
    b64Json?: string;
    mimeType?: string;
  }>;
  /** Forge image model enum, e.g. "MODEL_GPT_IMAGE_2". Defaults to GPT Image 2. */
  model?: string;
  /** Generation quality, e.g. "medium" | "high". Defaults to "medium" for GPT Image 2. */
  quality?: string;
};

export type GenerateImageResponse = {
  url?: string;
};

export async function generateImage(
  options: GenerateImageOptions,
): Promise<GenerateImageResponse> {
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
    "images.v1.ImageService/GenerateImage",
    baseUrl,
  ).toString();

  const model = options.model ?? DEFAULT_IMAGE_MODEL;
  const quality =
    options.quality ??
    (model === DEFAULT_IMAGE_MODEL ? DEFAULT_IMAGE_QUALITY : undefined);

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
        prompt: options.prompt,
        original_images: options.originalImages || [],
        model,
        ...(quality ? { quality } : {}),
      }),
      signal: AbortSignal.timeout(IMAGE_GENERATION_TIMEOUT_MS),
    });
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "TimeoutError"
        ? `Image generation request timed out after ${IMAGE_GENERATION_TIMEOUT_MS}ms`
        : `Image generation network error: ${String(error)}`;
    throw new Error(message);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Image generation request failed (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`,
    );
  }

  let result: {
    image?: {
      b64Json?: string;
      mimeType?: string;
    };
  };
  try {
    result = (await response.json()) as typeof result;
  } catch (error) {
    throw new Error(`Image generation returned invalid JSON: ${String(error)}`);
  }

  const image = result.image;
  if (
    !image ||
    typeof image.b64Json !== "string" ||
    image.b64Json.length === 0 ||
    typeof image.mimeType !== "string" ||
    image.mimeType.length === 0
  ) {
    throw new Error("Image generation returned an invalid image payload.");
  }

  const buffer = Buffer.from(image.b64Json, "base64");
  if (buffer.length === 0) {
    throw new Error("Image generation returned an empty image payload.");
  }

  // Save to S3
  const { url } = await storagePut(
    `generated/${Date.now()}.png`,
    buffer,
    image.mimeType,
  );
  return {
    url,
  };
}

export type ImageModelInfo = {
  /** Forge model enum, e.g. "MODEL_GPT_IMAGE_2". Pass into generateImage({ model }). */
  model?: string;
  /** Stable model id, e.g. "gpt-image-2". */
  id?: string;
};

export type ListImageModelsResponse = {
  models: ImageModelInfo[];
};

/**
 * List the image models the internal ImageService currently supports.
 * Feed a returned `model` value into generateImage({ model }).
 */
export async function listImageModels(): Promise<ListImageModelsResponse> {
  if (!ENV.forgeApiUrl) {
    throw new Error("BUILT_IN_FORGE_API_URL is not configured");
  }
  if (!ENV.forgeApiKey) {
    throw new Error("BUILT_IN_FORGE_API_KEY is not configured");
  }

  const baseUrl = ENV.forgeApiUrl.endsWith("/")
    ? ENV.forgeApiUrl
    : `${ENV.forgeApiUrl}/`;
  const fullUrl = new URL(
    "images.v1.ImageService/ListModels",
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
      body: "{}",
      signal: AbortSignal.timeout(IMAGE_MODELS_TIMEOUT_MS),
    });
  } catch (error) {
    const message =
      error instanceof DOMException && error.name === "TimeoutError"
        ? `List image models request timed out after ${IMAGE_MODELS_TIMEOUT_MS}ms`
        : `List image models network error: ${String(error)}`;
    throw new Error(message);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `List image models failed (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`,
    );
  }

  let result: { models?: ImageModelInfo[] };
  try {
    result = (await response.json()) as typeof result;
  } catch (error) {
    throw new Error(
      `List image models returned invalid JSON: ${String(error)}`,
    );
  }

  if (!Array.isArray(result.models)) {
    throw new Error("List image models returned an invalid models payload.");
  }
  return { models: result.models };
}
