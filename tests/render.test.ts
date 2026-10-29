// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import { emptyBuild } from "../src/lib/build";
import { addBuild, emptyState } from "../src/lib/storage";
import { renderNav, renderSavedBuilds, renderTable } from "../src/ui/render";

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
