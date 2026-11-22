// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { emptyBuild } from "../src/lib/build";
import { addBuild, emptyState } from "../src/lib/storage";
import { renderCompare, renderNav, renderSavedBuilds, renderTable } from "../src/ui/render";

const PAYLOAD = '<img src=x onerror="window.__pwned=1"><script>window.__pwned=1</script>';

describe("rendering never injects user strings as HTML", () => {
  it("table", () => {
    const build = emptyBuild();
    build.CPU = { model: PAYLOAD, priceCents: 1999 };
    const body = document.createElement("tbody");
    renderTable(body, build);
    expect(body.querySelector("img")).toBeNull();
    expect(body.querySelector("script")).toBeNull();
    expect(body.rows[0]?.cells[0]?.textContent).toBe("CPU");
    expect(body.rows[0]?.cells[1]?.textContent).toBe(PAYLOAD);
    expect(body.rows).toHaveLength(12);
    expect(body.rows[1]?.cells[1]?.textContent).toBe("Not set");
  });

  it("saved cards, including the name", () => {
    const parts = emptyBuild();
    parts.RAM = { model: PAYLOAD, priceCents: 5000 };
    const state = addBuild(emptyState(), { id: PAYLOAD, name: PAYLOAD.slice(0, 40), savedAt: "2026-01-01T00:00:00Z", parts })!;
    const container = document.createElement("div");
    const onLoad = vi.fn();
    const onDelete = vi.fn();
    renderSavedBuilds(container, state.builds, { onLoad, onDelete });
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("script")).toBeNull();
    expect(container.textContent).toContain(PAYLOAD);
    container.querySelectorAll("button")[1]?.click();
    expect(onDelete).toHaveBeenCalledWith(PAYLOAD);
  });

  it("empty saved list shows the helper text", () => {
    const container = document.createElement("div");
    renderSavedBuilds(container, [], { onLoad: vi.fn(), onDelete: vi.fn() });
    expect(container.textContent).toContain("No saved builds yet");
  });

  it("nav marks the active part", () => {
    const nav = document.createElement("div");
    renderNav(nav, emptyBuild(), "GPU", vi.fn());
    const current = nav.querySelectorAll('[aria-current="true"]');
    expect(current).toHaveLength(1);
    expect(current[0]?.getAttribute("data-part")).toBe("GPU");
    expect(nav.querySelectorAll("button")).toHaveLength(12);
  });
});

describe("build table semantics", () => {
  it("gives each row a row header, a model cell and a right-aligned price cell", () => {
    const body = document.createElement("tbody");
    renderTable(body, emptyBuild());
    const rows = body.querySelectorAll("tr");
    expect(rows).toHaveLength(12);
    for (const row of rows) {
      expect(row.querySelector("th[scope=row]")).not.toBeNull();
      expect(row.querySelectorAll("td")).toHaveLength(2);
      expect(row.querySelector("td.num")).not.toBeNull();
    }
  });
});

describe("compare two saved builds", () => {
  function twoBuilds() {
    const a = emptyBuild();
    a.CPU = { model: "Ryzen 5", priceCents: 20000 };
    const b = emptyBuild();
    b.CPU = { model: "Ryzen 7", priceCents: 40000 };
    b.GPU = { model: "RX 7600", priceCents: 30000 };
    const first = addBuild(emptyState(), { id: "a", name: "Budget", savedAt: "2026-01-01T00:00:00Z", parts: a })!;
    return addBuild(first, { id: "b", name: "Turbo", savedAt: "2026-01-02T00:00:00Z", parts: b })!;
  }

  it("shows each part's model and price plus the total delta, and does not load on pick", () => {
    const state = twoBuilds();
    const container = document.createElement("div");
    const onChange = vi.fn();
    const onLoad = vi.fn();
    renderCompare(container, state.builds, "a", "b", { onChange, onLoad });
    expect(container.querySelector("select#compareLeft")).not.toBeNull();
    expect(container.querySelector("select#compareRight")).not.toBeNull();
    expect(container.textContent).toContain("Ryzen 5");
    expect(container.textContent).toContain("RX 7600");
    expect(container.textContent).toContain("Not set");
    expect(container.querySelector("caption")?.textContent).toContain("Turbo minus Budget");
    const totalRow = container.querySelector("tfoot tr");
    expect(totalRow?.textContent).toContain("Total");
    expect(totalRow?.textContent).toMatch(/\+/); // +500,00 or similar for B-A
    const right = container.querySelector("select#compareRight") as HTMLSelectElement;
    right.value = "a";
    right.dispatchEvent(new Event("change"));
    expect(onChange).toHaveBeenCalledWith("a", "a");
    expect(onLoad).not.toHaveBeenCalled();
  });

  it("loads a build only when the load button is used", () => {
    const state = twoBuilds();
    const container = document.createElement("div");
    const onLoad = vi.fn();
    renderCompare(container, state.builds, "a", "b", { onChange: vi.fn(), onLoad });
    const loadBudget = [...container.querySelectorAll("button")].find((btn) => btn.getAttribute("aria-label") === "Load Budget");
    expect(loadBudget).toBeDefined();
    loadBudget?.click();
    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(onLoad).toHaveBeenCalledWith("a");
  });

  it("is usable from the keyboard via native selects and buttons", () => {
    const state = twoBuilds();
    const container = document.createElement("div");
    renderCompare(container, state.builds, "a", "b", { onChange: vi.fn(), onLoad: vi.fn() });
    const controls = container.querySelectorAll("select, button");
    expect(controls.length).toBeGreaterThanOrEqual(4);
    for (const node of controls) {
      expect((node as HTMLElement).tabIndex).toBeGreaterThanOrEqual(0);
      expect((node as HTMLButtonElement | HTMLSelectElement).disabled).toBeFalsy();
    }
  });

  it("does not inject markup from build names or models", () => {
    const parts = emptyBuild();
    parts.CPU = { model: PAYLOAD, priceCents: 100 };
    let state = addBuild(emptyState(), { id: "safe-a", name: PAYLOAD.slice(0, 40), savedAt: "2026-01-01T00:00:00Z", parts })!;
    state = addBuild(state, { id: "safe-b", name: "Other", savedAt: "2026-01-02T00:00:00Z", parts })!;
    const container = document.createElement("div");
    renderCompare(container, state.builds, "safe-a", "safe-b", { onChange: vi.fn(), onLoad: vi.fn() });
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("script")).toBeNull();
    expect(container.textContent).toContain(PAYLOAD.slice(0, 40));
  });

  it("explains how to compare when fewer than two builds are saved", () => {
    const container = document.createElement("div");
    renderCompare(container, [], null, null, { onChange: vi.fn(), onLoad: vi.fn() });
    expect(container.textContent).toContain("Save at least two builds");
    expect(container.querySelector("table")).toBeNull();
  });
});
