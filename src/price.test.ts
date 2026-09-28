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
    expect(formatPrice(12345678900)).toBe("¥123,456,789");
    expect(formatPrice(-123456789)).toBe("-¥1,234,567.89");
    expect(formatPrice(12345678905)).toBe("¥123,456,789.05");
    expect(formatPrice(100000)).toBe("¥1,000");
    expect(formatPrice(123456)).toBe("¥1,234.56");
  });

  it("puts the minus sign before the currency symbol", () => {
    expect(formatPrice(-1999)).toBe("-¥19.99");
  });
});
