// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { PRESETS } from "../src/lib/presets";
import { renderPresetInfo, renderRumours } from "../src/ui/examples";

describe("example build rendering", () => {
  it("shows purpose, why, total, key parts and the price note", () => {
    const container = document.createElement("div");
    const preset = PRESETS[0]!;
    renderPresetInfo(container, preset);
    expect(container.textContent).toContain(preset.name);
    expect(container.textContent).toContain(preset.purpose);
    expect(container.textContent).toContain(preset.why);
    expect(container.textContent).toContain("4.406,70");
    expect(container.textContent).toContain("Prices as of Oct 2026, check retailers.");
    expect(container.querySelectorAll(".preset-key-parts dt")).toHaveLength(3);
  });

  it("shows a hint when nothing is selected", () => {
    const container = document.createElement("div");
    renderPresetInfo(container, undefined);
    expect(container.textContent).toContain("Choose an example");
  });

  it("renders rumours with safe external links and no prices", () => {
    const note = document.createElement("p");
    const list = document.createElement("ul");
    renderRumours(note, list);
    expect(note.textContent).toContain("Rumoured");
    expect(list.querySelectorAll("li").length).toBeGreaterThanOrEqual(4);
    for (const link of list.querySelectorAll("a")) {
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      expect(link.getAttribute("href")?.startsWith("https://")).toBe(true);
    }
    expect(list.textContent).not.toMatch(/€/);
  });
});
