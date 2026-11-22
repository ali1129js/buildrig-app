import { isFilled, type PartEntry } from "./build";
import { PARTS, type PartName } from "./parts";
import type { SavedBuild } from "./storage";

export interface ComparedPart {
  part: PartName;
  left: PartEntry;
  right: PartEntry;
  /** Right price minus left price. Positive means the right-hand build costs more for this part. */
  deltaCents: number;
  /** Both sides have no model and a zero price. */
  bothEmpty: boolean;
}

export interface BuildComparison {
  left: SavedBuild;
  right: SavedBuild;
  parts: ComparedPart[];
  /** Right total minus left total, equal to the sum of the per-part deltas. */
  totalDeltaCents: number;
}

/** Part-by-part price comparison. Empty / missing parts count as 0 €. */
export function compareBuilds(left: SavedBuild, right: SavedBuild): BuildComparison {
  const parts: ComparedPart[] = PARTS.map((part) => {
    const leftEntry = left.parts[part];
    const rightEntry = right.parts[part];
    return {
      part,
      left: leftEntry,
      right: rightEntry,
      deltaCents: rightEntry.priceCents - leftEntry.priceCents,
      bothEmpty: !isFilled(leftEntry) && !isFilled(rightEntry)
    };
  });
  return {
    left,
    right,
    parts,
    totalDeltaCents: parts.reduce((sum, row) => sum + row.deltaCents, 0)
  };
}
