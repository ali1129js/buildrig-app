import { describe, expect, it } from "vitest";
import { filledParts, totalCents } from "../src/lib/build";
import { formatCents } from "../src/lib/money";
import { isPartName, MODEL_MAX_LENGTH, MAX_PRICE_CENTS, PARTS } from "../src/lib/parts";
import { getPreset, PRESETS, PRICE_NOTE, presetToBuild, presetTotalCents } from "../src/lib/presets";
import { RUMOURS, RUMOUR_NOTE } from "../src/lib/rumours";
import { parseBuild } from "../src/lib/storage";

/** Totals written down independently of the code, from buildrig-research.md. */
const EXPECTED_TOTALS_CENTS: Record<string, number> = {
  "gaming-4k": 440670,
  "gaming-budget": 112081,
  "dev-workstation": 235230,
  "local-ai": 430768,
  "content-creation": 448782,
  "compact-quiet": 112755
};

const DASHES = /[\u2013\u2014]/;

describe("presets", () => {
  it("has six presets with unique ids and names", () => {
    expect(PRESETS).toHaveLength(6);
    expect(new Set(PRESETS.map((p) => p.id)).size).toBe(6);
    expect(new Set(PRESETS.map((p) => p.name)).size).toBe(6);
  });

  it.each(PRESETS.map((p) => [p.id, p] as const))("%s only uses known categories and valid entries", (_id, preset) => {
    for (const [name, entry] of Object.entries(preset.parts)) {
      expect(isPartName(name)).toBe(true);
      expect(entry.model.trim()).not.toBe("");
      expect(entry.model.length).toBeLessThanOrEqual(MODEL_MAX_LENGTH);
      expect(Number.isInteger(entry.priceCents)).toBe(true);
      expect(entry.priceCents).toBeGreaterThanOrEqual(0);
      expect(entry.priceCents).toBeLessThanOrEqual(MAX_PRICE_CENTS);
    }
  });

  it.each(PRESETS.map((p) => [p.id, p] as const))("%s builds a full 12-category build that passes the saved-build validator", (_id, preset) => {
    const build = presetToBuild(preset);
    expect(Object.keys(build)).toEqual([...PARTS]);
    for (const part of PARTS) {
      expect(Number.isInteger(build[part].priceCents)).toBe(true);
    }
    expect(parseBuild(JSON.parse(JSON.stringify(build)))).toEqual(build);
  });

  it.each(PRESETS.map((p) => [p.id, p] as const))("%s fills the core categories", (_id, preset) => {
    const build = presetToBuild(preset);
    const filled = filledParts(build).map((item) => item.part);
    for (const core of ["CPU", "Motherboard", "RAM", "GPU", "Primary SSD", "Case", "Power Supply", "Cooling"] as const) {
      expect(filled).toContain(core);
    }
  });

  it("totals match the independently written values and the sum of the parts", () => {
    for (const preset of PRESETS) {
      const expected = EXPECTED_TOTALS_CENTS[preset.id];
      expect(expected, `missing expected total for ${preset.id}`).toBeDefined();
      expect(presetTotalCents(preset)).toBe(expected);
      const manual = Object.values(preset.parts).reduce((sum, entry) => sum + entry.priceCents, 0);
      expect(totalCents(presetToBuild(preset))).toBe(manual);
    }
  });

  it("formats totals as de-DE euros", () => {
    const preset = getPreset("gaming-4k");
    expect(preset).toBeDefined();
    expect(formatCents(presetTotalCents(preset!)).replace(/\s/g, " ")).toBe("4.406,70 €");
  });

  it("presetToBuild returns copies, so editing a build never changes a preset", () => {
    const preset = getPreset("compact-quiet")!;
    const build = presetToBuild(preset);
    build.CPU.priceCents = 1;
    expect(presetToBuild(preset).CPU.priceCents).toBe(16900);
  });

  it("has purpose, why and notes text, and uses no em or en dashes", () => {
    for (const preset of PRESETS) {
      expect(preset.purpose.length).toBeGreaterThan(5);
      expect(preset.why.length).toBeGreaterThan(20);
      const text = [preset.name, preset.purpose, preset.why, ...preset.notes, ...Object.values(preset.parts).map((e) => e.model)].join(" ");
      expect(text).not.toMatch(DASHES);
    }
    expect(PRICE_NOTE).toBe("Prices as of Oct 2026, check retailers.");
  });

  it("getPreset finds by id and returns undefined otherwise", () => {
    expect(getPreset("local-ai")?.name).toBe("Local AI and ML");
    expect(getPreset("nope")).toBeUndefined();
    expect(getPreset("")).toBeUndefined();
  });
});

describe("rumours", () => {
  it("are labelled as rumoured, have https sources, and contain no prices", () => {
    expect(RUMOUR_NOTE.toLowerCase()).toContain("rumoured");
    expect(RUMOURS.length).toBeGreaterThanOrEqual(4);
    for (const rumour of RUMOURS) {
      expect(rumour.sources.length).toBeGreaterThan(0);
      for (const source of rumour.sources) expect(source.url.startsWith("https://")).toBe(true);
      const text = `${rumour.title} ${rumour.summary}`;
      expect(text).not.toMatch(/[€$£]|\bEUR\b|\beuros?\b/i);
      expect(text).not.toMatch(DASHES);
    }
  });
});
