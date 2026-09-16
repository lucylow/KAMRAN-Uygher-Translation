import { describe, expect, it } from "vitest";

import { getProcessingStatusCopy } from "../lib/processing-status";

describe("KAMRAN processing status copy", () => {
  it("provides clear OCR stages for scan and translation work", () => {
    expect(getProcessingStatusCopy("ocr-preparing")).toEqual({
      label: "Preparing the scan",
      detail: "Enhancing the image before reading the text.",
    });
    expect(getProcessingStatusCopy("ocr-recognizing").label).toBe(
      "Reading the text",
    );
    expect(getProcessingStatusCopy("ocr-translating").label).toBe(
      "Translating the scan",
    );
  });

  it("provides clear voice stages for microphone and recognition work", () => {
    expect(getProcessingStatusCopy("voice-preparing").label).toBe(
      "Preparing voice input",
    );
    expect(getProcessingStatusCopy("voice-capturing").detail).toContain(
      "Speak naturally",
    );
    expect(getProcessingStatusCopy("voice-processing").label).toBe(
      "Recognizing your words",
    );
  });
});
