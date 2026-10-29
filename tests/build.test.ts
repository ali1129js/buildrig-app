import { describe, expect, it } from "vitest";
import { emptyBuild, filledParts, isFilled, summarize } from "../src/lib/build";

describe("isFilled", () => {
  it("is true for a model or a price above zero", () => {
    expect(isFilled({ model: "", priceCents: 0 })).toBe(false);
    expect(isFilled({ model: "   ", priceCents: 0 })).toBe(false);
    expect(isFilled({ model: "Ryzen", priceCents: 0 })).toBe(true);
    expect(isFilled({ model: "", priceCents: 1 })).toBe(true);
  });
});

describe("summarize", () => {
  it("handles an empty build", () => {
    expect(summarize(emptyBuild())).toEqual({ filled: 0, remaining: 12, totalCents: 0, averageCents: 0 });
  });

  it("sums cents and averages over filled parts", () => {
    const build = emptyBuild();
    build.CPU = { model: "A", priceCents: 10 };
    build.GPU = { model: "B", priceCents: 20 };
    build.RAM = { model: "C", priceCents: 20 };
    const summary = summarize(build);
    expect(summary.totalCents).toBe(50);
    expect(summary.filled).toBe(3);
    expect(summary.remaining).toBe(9);
    expect(summary.averageCents).toBe(17);
  });

  it("counts a model without price as filled, the same as saving does", () => {
    const build = emptyBuild();
    build.Case = { model: "Free case", priceCents: 0 };
    expect(summarize(build).filled).toBe(1);
    expect(filledParts(build)).toHaveLength(1);
  });

  it("has no float drift when adding many cent values", () => {
    const build = emptyBuild();
    build.CPU = { model: "x", priceCents: 10 };
    build.GPU = { model: "y", priceCents: 20 };
    expect(summarize(build).totalCents).toBe(30);
  });
});
