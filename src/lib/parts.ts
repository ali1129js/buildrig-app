export const PARTS = [
  "CPU",
  "Motherboard",
  "RAM",
  "GPU",
  "Primary SSD",
  "Storage II",
  "Case",
  "Power Supply",
  "Cooling",
  "Monitor",
  "Extra 1",
  "Extra 2"
] as const;

export type PartName = (typeof PARTS)[number];

export const MODEL_MAX_LENGTH = 60;
export const NAME_MAX_LENGTH = 40;
/** Largest accepted price: 9,999,999.99 EUR, in cents. */
export const MAX_PRICE_CENTS = 999_999_999;

export function isPartName(value: unknown): value is PartName {
  return typeof value === "string" && (PARTS as readonly string[]).includes(value);
}
