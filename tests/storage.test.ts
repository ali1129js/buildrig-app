import { describe, expect, it } from "vitest";
import { emptyBuild } from "../src/lib/build";
import {
  addBuild,
  clearBuilds,
  defaultName,
  emptyState,
  loadState,
  loadTheme,
  parseSavedBuild,
  removeBuild,
  saveState,
  LEGACY_STORAGE_KEY,
  STORAGE_KEY,
  THEME_KEY
} from "../src/lib/storage";

function memory(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value)
  };
}

function filledBuild() {
  const parts = emptyBuild();
  parts.CPU = { model: "Ryzen", priceCents: 34999 };
  return parts;
}

const input = (id: string, name = "") => ({ id, name, savedAt: "2026-01-01T10:00:00.000Z", parts: filledBuild() });

describe("naming", () => {
  it("never reuses a default name after deletes", () => {
    let state = emptyState();
    state = addBuild(state, input("a"))!;
    state = addBuild(state, input("b"))!;
    expect(state.builds.map((item) => item.name)).toEqual(["Build 2", "Build 1"]);
    state = removeBuild(state, "b");
    state = addBuild(state, input("c"))!;
    expect(state.builds.map((item) => item.name)).toEqual(["Build 3", "Build 1"]);
    state = clearBuilds(state);
    expect(defaultName(state)).toBe("Build 4");
  });

  it("uses a user-entered name and still advances the counter", () => {
    const state = addBuild(emptyState(), input("a", "  Gaming rig  "))!;
    expect(state.builds[0]?.name).toBe("Gaming rig");
    expect(state.nextNumber).toBe(2);
  });

  it("refuses to save an empty build", () => {
    expect(addBuild(emptyState(), { ...input("a"), parts: emptyBuild() })).toBeNull();
  });
});

describe("round trip and validation", () => {
  it("saves and loads", () => {
    const storage = memory();
    const state = addBuild(emptyState(), input("a"))!;
    expect(saveState(storage, state)).toEqual({ ok: true });
    const loaded = loadState(storage);
    expect(loaded.error).toBeNull();
    expect(loaded.skipped).toBe(0);
    expect(loaded.state.builds[0]?.totalCents).toBe(34999);
  });

  it("returns an empty state for corrupt JSON", () => {
    const loaded = loadState(memory({ [STORAGE_KEY]: "{not json" }));
    expect(loaded.state.builds).toEqual([]);
    expect(loaded.error).not.toBeNull();
  });

  it("returns an empty state for the wrong shape", () => {
    expect(loadState(memory({ [STORAGE_KEY]: '{"version":1}' })).error).not.toBeNull();
    expect(loadState(memory({ [STORAGE_KEY]: "42" })).error).not.toBeNull();
  });

  it("skips invalid builds but keeps valid ones", () => {
    const good = addBuild(emptyState(), input("good"))!.builds[0];
    const raw = JSON.stringify({
      version: 2,
      nextNumber: 5,
      builds: [good, { id: "bad", name: "x", savedAt: "nope", parts: {} }, { id: 5 }, null, good]
    });
    const loaded = loadState(memory({ [STORAGE_KEY]: raw }));
    expect(loaded.state.builds).toHaveLength(1);
    expect(loaded.skipped).toBe(4);
    expect(loaded.state.nextNumber).toBe(5);
  });

  it("rejects fractional, negative and oversize prices and long models", () => {
    const base = { id: "a", name: "n", savedAt: "2026-01-01T00:00:00Z" };
    expect(parseSavedBuild({ ...base, parts: { CPU: { model: "m", priceCents: 1.5 } } })).toBeNull();
    expect(parseSavedBuild({ ...base, parts: { CPU: { model: "m", priceCents: -1 } } })).toBeNull();
    expect(parseSavedBuild({ ...base, parts: { CPU: { model: "m", priceCents: 1e12 } } })).toBeNull();
    expect(parseSavedBuild({ ...base, parts: { CPU: { model: "x".repeat(61), priceCents: 1 } } })).toBeNull();
    expect(parseSavedBuild({ ...base, parts: { CPU: { model: 5, priceCents: 1 } } })).toBeNull();
  });

  it("ignores unknown part keys and recomputes the total from parts", () => {
    const parsed = parseSavedBuild({
      id: "a",
      name: "n",
      savedAt: "2026-01-01T00:00:00Z",
      totalCents: 999,
      parts: { CPU: { model: "m", priceCents: 100 }, Toaster: { model: "z", priceCents: 5 } }
    });
    expect(parsed?.totalCents).toBe(100);
    expect(parsed?.parts).not.toHaveProperty("Toaster");
  });

  it("keeps hostile strings as plain data", () => {
    const parts = emptyBuild();
    parts.CPU = { model: "<img src=x onerror=alert(1)>", priceCents: 1 };
    const state = addBuild(emptyState(), { ...input("a"), parts })!;
    const storage = memory();
    saveState(storage, state);
    expect(loadState(storage).state.builds[0]?.parts.CPU.model).toBe("<img src=x onerror=alert(1)>");
  });
});

describe("storage errors", () => {
  it("reports a failed write", () => {
    const failing = {
      getItem: () => null,
      setItem: () => {
        throw new DOMException("quota", "QuotaExceededError");
      }
    };
    expect(saveState(failing, emptyState()).ok).toBe(false);
  });

  it("reports a failed read", () => {
    const failing = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => undefined
    };
    const loaded = loadState(failing);
    expect(loaded.state.builds).toEqual([]);
    expect(loaded.error).not.toBeNull();
    expect(loadTheme(failing, true)).toBe("dark");
  });
});

describe("legacy v1 migration", () => {
  it("converts euro floats to cents", () => {
    const legacy = [
      {
        id: "build-1",
        name: "Build 1",
        savedAt: "2026-01-01T10:00:00.000Z",
        total: 349.99,
        parts: { CPU: { model: "Ryzen", price: 349.99 }, GPU: { model: "", price: 0 } }
      },
      "junk"
    ];
    const loaded = loadState(memory({ [LEGACY_STORAGE_KEY]: JSON.stringify(legacy) }));
    expect(loaded.state.builds[0]?.parts.CPU.priceCents).toBe(34999);
    expect(loaded.state.builds[0]?.totalCents).toBe(34999);
    expect(loaded.skipped).toBe(1);
  });
});

describe("theme", () => {
  it("uses a stored theme, else the system preference", () => {
    expect(loadTheme(memory({ [THEME_KEY]: "contrast" }), false)).toBe("contrast");
    expect(loadTheme(memory({ [THEME_KEY]: "neon" }), false)).toBe("light");
    expect(loadTheme(memory(), true)).toBe("dark");
  });
});
