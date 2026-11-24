import { z } from "zod";
import { emptyBuild, totalCents } from "./build";
import { MAX_PRICE_CENTS, MODEL_MAX_LENGTH, NAME_MAX_LENGTH, PARTS } from "./parts";
import { type SavedBuild, type SavedState } from "./storage";
import type { ConfirmOptions } from "../ui/confirm";

const partEntrySchema = z.object({
  model: z.string().max(MODEL_MAX_LENGTH),
  priceCents: z.number().int().min(0).max(MAX_PRICE_CENTS)
});

const partsSchema = z.object(
  Object.fromEntries(PARTS.map((part) => [part, partEntrySchema.optional()])) as Record<
    (typeof PARTS)[number],
    z.ZodOptional<typeof partEntrySchema>
  >
);

const savedBuildSchema = z.object({
  id: z.string().min(1).max(80),
  name: z.string().max(NAME_MAX_LENGTH),
  savedAt: z.string().refine((value) => !Number.isNaN(new Date(value).getTime()), "savedAt must be a date"),
  totalCents: z.number().int().optional(),
  parts: partsSchema
});

export const exportFileSchema = z.object({
  version: z.literal(2),
  nextNumber: z.number().int().min(1).lt(1_000_000).optional(),
  exportedAt: z.string().optional(),
  builds: z.array(savedBuildSchema)
});

export const IMPORT_ERROR = "This file is not a valid BuildRig v2 export.";

export function serializeExport(state: SavedState, exportedAt = new Date().toISOString()): string {
  return `${JSON.stringify({ version: 2 as const, exportedAt, nextNumber: state.nextNumber, builds: state.builds }, null, 2)}\n`;
}

export function exportFilename(now = new Date()): string {
  return `buildrig-builds-${now.toISOString().slice(0, 10)}.json`;
}

export type ParseImportResult = { ok: true; state: SavedState } | { ok: false; error: string };

function toSavedBuild(value: z.infer<typeof savedBuildSchema>): SavedBuild {
  const parts = emptyBuild();
  for (const part of PARTS) {
    const entry = value.parts[part];
    if (entry) parts[part] = entry;
  }
  return {
    id: value.id,
    name: value.name,
    savedAt: value.savedAt,
    totalCents: totalCents(parts),
    parts
  };
}

export function parseImport(raw: string): ParseImportResult {
  let value: unknown;
  try {
    value = JSON.parse(raw) as unknown;
  } catch {
    return { ok: false, error: IMPORT_ERROR };
  }
  const parsed = exportFileSchema.safeParse(value);
  if (!parsed.success) return { ok: false, error: IMPORT_ERROR };
  const seen = new Set<string>();
  const builds: SavedBuild[] = [];
  for (const item of parsed.data.builds) {
    if (seen.has(item.id)) return { ok: false, error: IMPORT_ERROR };
    seen.add(item.id);
    builds.push(toSavedBuild(item));
  }
  const rawNext = parsed.data.nextNumber;
  const nextNumber =
    typeof rawNext === "number" ? rawNext : builds.length + 1;
  return {
    ok: true,
    state: { version: 2, nextNumber: Math.max(nextNumber, builds.length + 1), builds }
  };
}

export type ImportApplyResult = {
  accepted: boolean;
  state: SavedState;
  message: string;
};

/** Validates the file first. Confirmation runs only for a valid export. Cancel leaves `current` unchanged. */
export async function applyImport(
  raw: string,
  current: SavedState,
  confirm: (options: ConfirmOptions) => Promise<boolean>
): Promise<ImportApplyResult> {
  const parsed = parseImport(raw);
  if (!parsed.ok) {
    return { accepted: false, state: current, message: parsed.error };
  }
  const incoming = parsed.state.builds.length;
  const existing = current.builds.length;
  const ok = await confirm({
    title: "Replace saved builds?",
    message: `Import ${incoming} ${incoming === 1 ? "build" : "builds"} and replace the ${existing} currently saved in this browser? This cannot be undone.`,
    confirmLabel: "Replace builds"
  });
  if (!ok) {
    return { accepted: false, state: current, message: "Import cancelled. Your saved builds are unchanged." };
  }
  return {
    accepted: true,
    state: parsed.state,
    message: `Imported ${incoming} ${incoming === 1 ? "build" : "builds"}.`
  };
}
