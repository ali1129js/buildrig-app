import { PARTS, type PartName } from "./parts";

export interface PartEntry {
  model: string;
  /** Price in integer cents. */
  priceCents: number;
}

export type Build = Record<PartName, PartEntry>;

export interface Summary {
  filled: number;
  remaining: number;
  totalCents: number;
  /** Average over filled parts, rounded to whole cents. 0 when nothing is filled. */
  averageCents: number;
}

export function emptyEntry(): PartEntry {
  return { model: "", priceCents: 0 };
}

export function emptyBuild(): Build {
  const build = {} as Build;
  for (const part of PARTS) build[part] = emptyEntry();
  return build;
}

/** The single definition of a filled part: it has a model name or a price above zero. */
export function isFilled(entry: PartEntry): boolean {
  return entry.model.trim() !== "" || entry.priceCents > 0;
}

export function filledParts(build: Build): Array<{ part: PartName; entry: PartEntry }> {
  const result: Array<{ part: PartName; entry: PartEntry }> = [];
  for (const part of PARTS) {
    const entry = build[part];
    if (isFilled(entry)) result.push({ part, entry });
  }
  return result;
}

export function totalCents(build: Build): number {
  let sum = 0;
  for (const part of PARTS) sum += build[part].priceCents;
  return sum;
}

export function summarize(build: Build): Summary {
  const filled = filledParts(build).length;
  const total = totalCents(build);
  return {
    filled,
    remaining: PARTS.length - filled,
    totalCents: total,
    averageCents: filled === 0 ? 0 : Math.round(total / filled)
  };
}

export function cloneBuild(build: Build): Build {
  const copy = emptyBuild();
  for (const part of PARTS) copy[part] = { ...build[part] };
  return copy;
}
