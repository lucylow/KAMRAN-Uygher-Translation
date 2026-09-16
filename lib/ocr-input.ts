export type OCRInputSource = "camera" | "gallery";

export interface OCRInputOption {
  id: OCRInputSource;
  label: string;
  guidance: string;
  requiresPermission: boolean;
}

export const OCR_INPUT_OPTIONS: OCRInputOption[] = [
  { id: "camera", label: "Use camera", guidance: "Align text inside the frame with steady lighting.", requiresPermission: true },
  { id: "gallery", label: "Choose image", guidance: "Select a clear document image from your photo library.", requiresPermission: true },
];

export interface OCRReviewMetadata {
  characterCount: number;
  lineCount: number;
  isMultiLine: boolean;
}

export function getOCRReviewMetadata(text: string): OCRReviewMetadata {
  const normalized = text.replace(/\r\n/g, "\n");
  const lines = normalized ? normalized.split("\n") : [];
  return {
    characterCount: normalized.length,
    lineCount: lines.length,
    isMultiLine: lines.length > 1,
  };
}

export function getOCRReadinessMessage(source: OCRInputSource): string {
  return source === "camera"
    ? "Camera permission will be requested when native capture is enabled."
    : "Photo-library permission will be requested when image import is enabled.";
}

export type OCRResultStatus = "idle" | "copied" | "saved";

export function getOCRResultStatusMessage(status: OCRResultStatus): string {
  if (status === "copied") return "Translation copied to clipboard.";
  if (status === "saved") return "Translation saved to history.";
  return "Translation ready.";
}

export interface OCRTextValidation {
  valid: boolean;
  message: string;
}

export function validateOCRText(text: string): OCRTextValidation {
  if (!text.trim()) return { valid: false, message: "Add or review detected text before translating." };
  return { valid: true, message: "Detected text is ready to translate." };
}

export function getOCRSourcePreviewLabel(source: OCRInputSource): string {
  return source === "camera" ? "Live camera preview ready" : "Gallery image preview ready";
}

export function getOCRInputOption(source: OCRInputSource): OCRInputOption {
  return OCR_INPUT_OPTIONS.find((option) => option.id === source) ?? OCR_INPUT_OPTIONS[0];
}
