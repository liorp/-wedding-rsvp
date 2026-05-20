import { describe, expect, it } from "vitest";
import { validatePhone } from "@/lib/validation";

describe("validatePhone", () => {
  it("allows an empty optional phone", () => {
    expect(validatePhone("")).toBe(true);
  });

  it("accepts Israeli mobile numbers with punctuation", () => {
    expect(validatePhone("050-123-4567")).toBe(true);
  });

  it("accepts international Israeli mobile numbers", () => {
    expect(validatePhone("972501234567")).toBe(true);
  });

  it("rejects unsupported prefixes", () => {
    expect(validatePhone("031234567")).toBe("מספר טלפון חייב להתחיל ב-05");
  });

  it("reports missing digits for short mobile numbers", () => {
    expect(validatePhone("050123")).toBe("חסרות 4 ספרות במספר הטלפון");
  });

  it("rejects overly long local mobile numbers", () => {
    expect(validatePhone("05012345678")).toBe("מספר הטלפון ארוך מדי");
  });
});
