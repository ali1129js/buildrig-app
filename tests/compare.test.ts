import { describe, expect, it } from "vitest";
import { emptyBuild } from "../src/lib/build";
import { compareBuilds } from "../src/lib/compare";
import type { SavedBuild } from "../src/lib/storage";

function saved(id: string, name: string, tweak: (build: ReturnType<typeof emptyBuild>) => void): SavedBuild {
  const parts = emptyBuild();
  tweak(parts);
  const totalCents = Object.values(parts).reduce((sum, entry) => sum + entry.priceCents, 0);
  return { id, name, savedAt: "2026-11-22T10:00:00.000Z", totalCents, parts };
}

describe("compareBuilds", () => {
  it("returns a zero delta for identical builds", () => {
    const a = saved("a", "Office", (p) => {
      p.CPU = { model: "Ryzen 5", priceCents: 20000 };
      p.GPU = { model: "RX 7600", priceCents: 30000 };
    });
    const b = saved("b", "Office copy", (p) => {
      p.CPU = { model: "Ryzen 5", priceCents: 20000 };
      p.GPU = { model: "RX 7600", priceCents: 30000 };
    });
    const cmp = compareBuilds(a, b);
    expect(cmp.totalDeltaCents).toBe(0);
    expect(cmp.parts.every((row) => row.deltaCents === 0)).toBe(true);
    expect(cmp.parts).toHaveLength(12);
  });

  it("treats a missing part as 0 € and still shows the other side's model", () => {
    const left = saved("left", "No GPU", (p) => {
      p.CPU = { model: "Ryzen 5", priceCents: 20000 };
    });
    const right = saved("right", "With GPU", (p) => {
      p.CPU = { model: "Ryzen 5", priceCents: 20000 };
      p.GPU = { model: "RX 7600", priceCents: 30000 };
    });
    const cmp = compareBuilds(left, right);
    const gpu = cmp.parts.find((row) => row.part === "GPU")!;
    expect(gpu.left.model).toBe("");
    expect(gpu.left.priceCents).toBe(0);
    expect(gpu.right.model).toBe("RX 7600");
    expect(gpu.deltaCents).toBe(30000);
    expect(gpu.bothEmpty).toBe(false);
    const caseRow = cmp.parts.find((row) => row.part === "Case")!;
    expect(caseRow.bothEmpty).toBe(true);
    expect(cmp.totalDeltaCents).toBe(30000);
  });

  it("gives the delta a positive sign when the right build is more expensive, and negative when it is cheaper", () => {
    const cheaper = saved("cheap", "Budget", (p) => {
      p.CPU = { model: "i5", priceCents: 15000 };
    });
    const pricier = saved("pricey", "Turbo", (p) => {
      p.CPU = { model: "i7", priceCents: 40000 };
    });
    expect(compareBuilds(cheaper, pricier).totalDeltaCents).toBe(25000);
    expect(compareBuilds(pricier, cheaper).totalDeltaCents).toBe(-25000);
    expect(compareBuilds(cheaper, pricier).parts.find((row) => row.part === "CPU")!.deltaCents).toBe(25000);
    expect(compareBuilds(pricier, cheaper).parts.find((row) => row.part === "CPU")!.deltaCents).toBe(-25000);
  });
});
