import { MAX_PRICE_CENTS } from "./parts";

const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

/** Formats integer cents as de-DE euros, e.g. 34999 -> "349,99 €". Zero formats too. */
export function formatCents(cents: number): string {
  return euro.format(cents / 100);
}

/**
 * Parses user input such as "349.99", "349,99" or "350" into integer cents.
 * Returns null for anything else (negative, too many decimals, text, too large).
 * Works on the string directly so no floating point is involved.
 */
export function parsePriceToCents(input: string): number | null {
  const match = /^(\d{1,7})(?:[.,](\d{1,2}))?$/.exec(input.trim());
  if (!match) return null;
  const whole = Number(match[1]);
  const fraction = Number((match[2] ?? "").padEnd(2, "0"));
  const cents = whole * 100 + fraction;
  return cents <= MAX_PRICE_CENTS ? cents : null;
}

/** Formats integer cents for an input field, e.g. 34999 -> "349,99", 35000 -> "350". */
export function centsToInputValue(cents: number): string {
  if (cents <= 0) return "";
  const whole = Math.floor(cents / 100);
  const fraction = cents % 100;
  return fraction === 0 ? String(whole) : `${whole},${String(fraction).padStart(2, "0")}`;
}
