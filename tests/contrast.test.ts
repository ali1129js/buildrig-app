import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../src/styles/themes.css", import.meta.url), "utf8");

function parseTheme(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  expect(start, `theme block ${selector}`).toBeGreaterThanOrEqual(0);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  const tokens: Record<string, string> = {};
  for (const match of body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    const [, name, value] = match;
    if (name && value) tokens[name] = value;
  }
  return tokens;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((index) => {
    const value = parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const [r = 0, g = 0, b = 0] = channels;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Text pairs need 4.5:1 (WCAG AA). Non-text (borders, focus ring) need 3:1. */
const TEXT_PAIRS: Array<[string, string]> = [
  ["text", "bg"],
  ["text", "surface"],
  ["text", "surface-2"],
  ["text", "tab-active"],
  ["muted", "bg"],
  ["muted", "surface"],
  ["muted", "surface-2"],
  ["muted", "tab-active"],
  ["on-primary", "primary"],
  ["on-primary", "primary-hover"],
  ["on-secondary", "secondary"],
  ["on-secondary", "secondary-hover"],
  ["on-accent", "accent"],
  ["field-text", "field-bg"],
  ["placeholder", "field-bg"],
  ["table-text", "table-bg"],
  ["table-text", "table-alt"],
  ["table-head-text", "table-head-bg"],
  ["banner-text", "banner-bg"]
];

const NON_TEXT_PAIRS: Array<[string, string]> = [
  ["border", "bg"],
  ["border", "surface"],
  ["border", "surface-2"],
  ["border", "field-bg"],
  ["focus", "bg"],
  ["focus", "surface"],
  ["focus", "surface-2"],
  ["primary", "surface"]
];

const THEMES: Array<[string, string]> = [
  ["light", ':root,\n[data-theme="light"]'],
  ["dark", '[data-theme="dark"]'],
  ["contrast", '[data-theme="contrast"]']
];

describe.each(THEMES)("theme %s", (_name, selector) => {
  const tokens = parseTheme(selector);

  it.each(TEXT_PAIRS)("text %s on %s has at least 4.5:1", (fg, bg) => {
    const fgValue = tokens[fg];
    const bgValue = tokens[bg];
    expect(fgValue, `token ${fg}`).toBeDefined();
    expect(bgValue, `token ${bg}`).toBeDefined();
    expect(contrast(fgValue as string, bgValue as string)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(NON_TEXT_PAIRS)("%s against %s has at least 3:1", (fg, bg) => {
    expect(contrast(tokens[fg] as string, tokens[bg] as string)).toBeGreaterThanOrEqual(3);
  });
});

describe("all themes define the same tokens", () => {
  it("matches the light token set", () => {
    const light = Object.keys(parseTheme(THEMES[0]![1])).sort();
    for (const [, selector] of THEMES.slice(1)) {
      expect(Object.keys(parseTheme(selector)).sort()).toEqual(light);
    }
  });
});
