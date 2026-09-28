import { describe, expect, it } from "vitest";
import { formatPrice } from "./price";

describe("formatPrice", () => {
  it("formats whole yuan", () => {
    expect(formatPrice(1000)).toBe("¥10");
  });

  it("formats cents remainder", () => {
    expect(formatPrice(1999)).toBe("¥19.99");
  });
});
