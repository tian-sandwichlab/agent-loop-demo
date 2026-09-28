import { describe, expect, it } from "vitest";
import { formatPrice } from "./price";

describe("formatPrice", () => {
  it("formats whole yuan", () => {
    expect(formatPrice(1000)).toBe("¥10");
  });
});
