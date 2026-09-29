import { describe, expect, it } from "vitest";
import html from "./index.html?raw";

describe("index.html", () => {
  it("declares a device-width viewport so mobile browsers render text at readable size", () => {
    expect(html).toMatch(
      /<meta\s+name="viewport"\s+content="[^"]*width=device-width[^"]*"\s*\/?>/
    );
  });
});
