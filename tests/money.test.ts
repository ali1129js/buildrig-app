import { describe, expect, it } from "vitest";
import { centsToInputValue, formatCents, parsePriceToCents } from "../src/lib/money";

const NBSP = "\u00a0";

describe("formatCents", () => {
  it("formats de-DE euros including zero", () => {
    expect(formatCents(0)).toBe(`0,00${NBSP}€`);
    expect(formatCents(34999)).toBe(`349,99${NBSP}€`);
    expect(formatCents(123456789)).toBe(`1.234.567,89${NBSP}€`);
  });
});

describe("parsePriceToCents", () => {
  it("accepts dot and comma decimals", () => {
    expect(parsePriceToCents("349.99")).toBe(34999);
    expect(parsePriceToCents("349,99")).toBe(34999);
    expect(parsePriceToCents(" 350 ")).toBe(35000);
    expect(parsePriceToCents("0,5")).toBe(50);
    expect(parsePriceToCents("0")).toBe(0);
  });

  it("avoids floating point errors", () => {
    expect(parsePriceToCents("0.29")).toBe(29);
    expect(parsePriceToCents("1.15")).toBe(115);
    expect(parsePriceToCents("19.99")).toBe(1999);
  });

  it("rejects invalid input", () => {
    for (const bad of ["", "abc", "-5", "1.234", "1,2,3", "1e3", "12345678", "9999999,995", "€5", "Infinity"]) {
      expect(parsePriceToCents(bad)).toBeNull();
    }
  });

  it("accepts the maximum price", () => {
    expect(parsePriceToCents("9999999,99")).toBe(999_999_999);
  });
});

describe("centsToInputValue", () => {
  it("round trips with parsePriceToCents", () => {
    for (const cents of [1, 50, 99, 100, 34999, 35000, 999_999_999]) {
      expect(parsePriceToCents(centsToInputValue(cents))).toBe(cents);
    }
    expect(centsToInputValue(0)).toBe("");
  });
});
