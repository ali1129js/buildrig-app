import { describe, expect, it, vi } from "vitest";
import { emptyBuild } from "../src/lib/build";
import { addBuild, emptyState } from "../src/lib/storage";
import { applyImport, exportFilename, parseImport, serializeExport } from "../src/lib/transfer";

function filledBuild() {
  const parts = emptyBuild();
  parts.CPU = { model: "Ryzen", priceCents: 34999 };
  return parts;
}

function sampleState() {
  return addBuild(emptyState(), {
    id: "a",
    name: "Gaming rig",
    savedAt: "2026-01-01T10:00:00.000Z",
    parts: filledBuild()
  })!;
}

describe("export and import", () => {
  it("round-trips a saved list, recomputes totals and keeps nextNumber", () => {
    const state = sampleState();
    const json = serializeExport(state, "2026-11-24T12:00:00.000Z");
    const payload = JSON.parse(json) as { version: number; exportedAt: string; nextNumber: number };
    expect(payload.version).toBe(2);
    expect(payload.exportedAt).toBe("2026-11-24T12:00:00.000Z");
    expect(payload.nextNumber).toBe(2);
    const imported = parseImport(json);
    expect(imported).toEqual({ ok: true, state });
    expect(imported.ok && imported.state.builds[0]?.totalCents).toBe(34999);
  });

  it("names the download with a date and the v2 schema", () => {
    expect(exportFilename(new Date("2026-11-24T15:00:00.000Z"))).toBe("buildrig-builds-2026-11-24.json");
  });

  it("rejects corrupt JSON, the wrong version, and a bad build without changing the current list", async () => {
    const current = sampleState();
    const confirm = vi.fn(async () => true);
    for (const raw of [
      "{not json",
      JSON.stringify({ version: 1, builds: [] }),
      JSON.stringify({ version: 2, builds: [{ id: "bad", name: "x", savedAt: "nope", parts: {} }] }),
      JSON.stringify({ version: 2, builds: [{ id: "a", name: "n", savedAt: "2026-01-01T00:00:00Z", parts: { CPU: { model: "m", priceCents: 1.5 } } }] }),
      JSON.stringify({
        version: 2,
        builds: [
          { id: "dup", name: "one", savedAt: "2026-01-01T00:00:00Z", parts: { CPU: { model: "m", priceCents: 1 } } },
          { id: "dup", name: "two", savedAt: "2026-01-01T00:00:00Z", parts: { CPU: { model: "n", priceCents: 2 } } }
        ]
      })
    ]) {
      const result = await applyImport(raw, current, confirm);
      expect(result.accepted).toBe(false);
      expect(result.state).toBe(current);
      expect(result.message).toMatch(/not a valid BuildRig v2 export/);
    }
    expect(confirm).not.toHaveBeenCalled();
  });

  it("asks for confirmation before replacing, and cancel leaves the list unchanged", async () => {
    const current = sampleState();
    const incoming = addBuild(emptyState(), {
      id: "b",
      name: "Office",
      savedAt: "2026-02-01T10:00:00.000Z",
      parts: filledBuild()
    })!;
    const cancel = vi.fn(async () => false);
    const cancelled = await applyImport(serializeExport(incoming), current, cancel);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(cancel).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Replace saved builds?",
        confirmLabel: "Replace builds"
      })
    );
    expect(cancelled).toEqual({
      accepted: false,
      state: current,
      message: "Import cancelled. Your saved builds are unchanged."
    });
    expect(current.builds[0]?.id).toBe("a");

    const confirm = vi.fn(async () => true);
    const applied = await applyImport(serializeExport(incoming), current, confirm);
    expect(applied.accepted).toBe(true);
    expect(applied.state.builds.map((item) => item.id)).toEqual(["b"]);
    expect(applied.message).toBe("Imported 1 build.");
    expect(current.builds[0]?.id).toBe("a");
  });
});
