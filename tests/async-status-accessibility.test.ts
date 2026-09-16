import { describe, expect, it } from "vitest";

import { getAsyncStatusAccessibilityRole } from "../lib/async-status-accessibility";

describe("async status accessibility", () => {
  it("uses an alert role for error messages", () => {
    expect(getAsyncStatusAccessibilityRole("error")).toBe("alert");
  });

  it("uses a text role for informational and success messages", () => {
    expect(getAsyncStatusAccessibilityRole("info")).toBe("text");
    expect(getAsyncStatusAccessibilityRole("success")).toBe("text");
  });
});
