import { describe, expect, it } from "vitest";
import { formatPrice } from "./price";

describe("formatPrice", () => {
  it("formats whole yuan", () => {
    expect(formatPrice(1000)).toBe("￥10");
  });

  it("formats fractional yuan", () => {
    expect(formatPrice(1999)).toBe("￥19.99");
  });

  it("puts the minus sign before the currency symbol", () => {
    expect(formatPrice(-1999)).toBe("-￥19.99");
  });

  it("uses the full-width yuan sign", () => {
    expect(formatPrice(1999).charAt(0)).toBe("￥");
  });
});
