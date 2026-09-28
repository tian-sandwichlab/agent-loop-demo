import { describe, expect, it } from "vitest";
import { formatPrice } from "./price";

describe("formatPrice", () => {
  it("formats whole yuan", () => {
    expect(formatPrice(1000)).toBe("¥10");
  });

  it("formats fractional yuan", () => {
    expect(formatPrice(1999)).toBe("¥19.99");
  });

  it("groups the yuan part with thousands separators", () => {
    expect(formatPrice(123456789)).toBe("¥1,234,567.89");
  });

  it("puts the minus sign before the currency symbol", () => {
    expect(formatPrice(-1999)).toBe("-¥19.99");
  });
});
