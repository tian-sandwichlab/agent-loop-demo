import { describe, expect, it } from "vitest";
import html from "./index.html?raw";
import mainTs from "./src/main.ts?raw";

const HEX_COLOR = /#[0-9a-fA-F]{6}/;

function relativeLuminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((offset) => {
    const channel = parseInt(hex.slice(1 + offset, 3 + offset), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foreground: string, background: string): number {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a
  );
  return (lighter + 0.05) / (darker + 0.05);
}

function declarationsFor(css: string, selector: string): string {
  return css.match(new RegExp(`${selector}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
}

function colorOf(declarations: string): string {
  return declarations.match(/(?:^|;)\s*color:\s*(#[0-9a-fA-F]{6})\s*;/m)?.[1] ?? "";
}

function backgroundColorOf(declarations: string): string {
  return declarations.match(/background-color:\s*(#[0-9a-fA-F]{6})\s*;/)?.[1] ?? "";
}

const style = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? "";
const lightCss = style.replace(/@media[\s\S]*$/, "");
const darkCss = style.match(/@media\s*\(prefers-color-scheme:\s*dark\)\s*\{([\s\S]*)\}/)?.[1] ?? "";

describe("index.html", () => {
  it("declares a device-width viewport so mobile browsers render text at readable size", () => {
    expect(html).toMatch(
      /<meta\s+name="viewport"\s+content="[^"]*width=device-width[^"]*"\s*\/?>/
    );
  });

  it("declares color-scheme as light dark via both the meta tag and :root CSS", () => {
    expect(html).toMatch(/<meta\s+name="color-scheme"\s+content="light dark"\s*\/?>/);
    expect(lightCss).toMatch(/color-scheme:\s*light\s+dark\s*;/);
  });

  it("defines explicit text and background colors for the light scheme", () => {
    for (const selector of ["body", "#app"]) {
      const declarations = declarationsFor(lightCss, selector);
      expect(colorOf(declarations)).toMatch(HEX_COLOR);
      expect(backgroundColorOf(declarations)).toMatch(HEX_COLOR);
    }
  });

  it("defines explicit text and background colors inside a prefers-color-scheme: dark media query", () => {
    expect(darkCss).not.toBe("");
    for (const selector of ["body", "#app"]) {
      const declarations = declarationsFor(darkCss, selector);
      expect(colorOf(declarations)).toMatch(HEX_COLOR);
      expect(backgroundColorOf(declarations)).toMatch(HEX_COLOR);
    }
  });

  it("keeps text readable in both schemes (WCAG AA contrast of at least 4.5:1)", () => {
    for (const css of [lightCss, darkCss]) {
      const declarations = declarationsFor(css, "body");
      const color = colorOf(declarations);
      const background = backgroundColorOf(declarations);
      expect(color).toMatch(HEX_COLOR);
      expect(background).toMatch(HEX_COLOR);
      expect(contrastRatio(color, background)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("leaves the price rendering in src/main.ts untouched", () => {
    expect(mainTs).toMatch(/app\.textContent = `示例价格: \$\{formatPrice\(/);
  });
});
