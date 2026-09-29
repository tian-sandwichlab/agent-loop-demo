import { describe, expect, it } from "vitest";
import { formatPrice } from "./price";

describe("formatPrice", () => {
  it("formats whole yuan", () => {
    expect(formatPrice(1000)).toBe("￥10");
  });

  it("formats fractional yuan", () => {
    expect(formatPrice(1999)).toBe("￥19.99");
  });

  it("keeps two decimal places when the fen digit is 0", () => {
    expect(formatPrice(1990)).toBe("￥19.90");
    expect(formatPrice(1050)).toBe("￥10.50");
  });

  it("rounds non-integer fen to the nearest cent", () => {
    expect(formatPrice(1234.5)).toBe("￥12.35");
    expect(formatPrice(1234.4)).toBe("￥12.34");
  });

  it("puts the minus sign before the currency symbol", () => {
    expect(formatPrice(-1999)).toBe("-￥19.99");
  });

  it("uses the full-width yuan sign", () => {
    expect(formatPrice(1999).charAt(0)).toBe("￥");
  });
});
