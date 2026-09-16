export type ProcessingStatusKey =
  | "ocr-preparing"
  | "ocr-recognizing"
  | "ocr-translating"
  | "voice-preparing"
  | "voice-capturing"
  | "voice-processing";

export type ProcessingStatusCopy = {
  label: string;
  detail: string;
};

const PROCESSING_STATUS_COPY: Record<
  ProcessingStatusKey,
  ProcessingStatusCopy
> = {
  "ocr-preparing": {
    label: "Preparing the scan",
    detail: "Enhancing the image before reading the text.",
  },
  "ocr-recognizing": {
    label: "Reading the text",
    detail: "Detecting Uyghur and Chinese script.",
  },
  "ocr-translating": {
    label: "Translating the scan",
    detail: "Converting the reviewed text into the selected language.",
  },
  "voice-preparing": {
    label: "Preparing voice input",
    detail: "Checking the microphone channel.",
  },
  "voice-capturing": {
    label: "Listening",
    detail: "Speak naturally; KAMRAN will process the phrase when you stop.",
  },
  "voice-processing": {
    label: "Recognizing your words",
    detail: "Turning the captured phrase into editable text.",
  },
};

export function getProcessingStatusCopy(
  key: ProcessingStatusKey,
): ProcessingStatusCopy {
  return PROCESSING_STATUS_COPY[key];
}
