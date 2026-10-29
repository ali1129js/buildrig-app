import { emptyBuild, filledParts, totalCents, type Build } from "./build";
import { MODEL_MAX_LENGTH, NAME_MAX_LENGTH, PARTS, MAX_PRICE_CENTS } from "./parts";

export const STORAGE_KEY = "buildrig.savedBuilds.v2";
export const LEGACY_STORAGE_KEY = "buildrig.savedBuilds.v1";
export const THEME_KEY = "buildrig.theme.v1";

export interface SavedBuild {
  id: string;
  name: string;
  savedAt: string;
  totalCents: number;
  parts: Build;
}

export interface SavedState {
  version: 2;
  /** Next number used for default names. Only ever increases, so names never repeat after deletes. */
  nextNumber: number;
  builds: SavedBuild[];
}

export interface LoadResult {
  state: SavedState;
  /** Number of stored builds that failed validation and were skipped. */
  skipped: number;
  /** Set when storage could not be read at all. */
  error: string | null;
}

export type SaveResult = { ok: true } | { ok: false; error: string };

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCents(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= MAX_PRICE_CENTS;
}

export function emptyState(): SavedState {
  return { version: 2, nextNumber: 1, builds: [] };
}

/** Returns a validated Build, or null if any part is malformed. Missing parts become empty. */
export function parseBuild(value: unknown): Build | null {
  if (!isRecord(value)) return null;
  const build = emptyBuild();
  for (const part of PARTS) {
    const raw = value[part];
    if (raw === undefined) continue;
    if (!isRecord(raw)) return null;
    const { model, priceCents } = raw;
    if (typeof model !== "string" || model.length > MODEL_MAX_LENGTH) return null;
    if (!isCents(priceCents)) return null;
    build[part] = { model, priceCents };
  }
  return build;
}

/** Returns a validated SavedBuild, or null. The total is always recomputed from the parts. */
export function parseSavedBuild(value: unknown): SavedBuild | null {
  if (!isRecord(value)) return null;
  const { id, name, savedAt } = value;
  if (typeof id !== "string" || id === "" || id.length > 80) return null;
  if (typeof name !== "string" || name.length > NAME_MAX_LENGTH) return null;
  if (typeof savedAt !== "string" || Number.isNaN(new Date(savedAt).getTime())) return null;
  const parts = parseBuild(value["parts"]);
  if (!parts) return null;
  return { id, name, savedAt, totalCents: totalCents(parts), parts };
}

/** Validates a whole stored state. Invalid builds are skipped and counted, duplicates by id dropped. */
export function parseState(value: unknown): { state: SavedState; skipped: number } | null {
  if (!isRecord(value) || value["version"] !== 2 || !Array.isArray(value["builds"])) return null;
  const builds: SavedBuild[] = [];
  const seen = new Set<string>();
  let skipped = 0;
  for (const item of value["builds"]) {
    const parsed = parseSavedBuild(item);
    if (!parsed || seen.has(parsed.id)) {
      skipped += 1;
      continue;
    }
    seen.add(parsed.id);
    builds.push(parsed);
  }
  const rawNext = value["nextNumber"];
  const nextNumber =
    typeof rawNext === "number" && Number.isInteger(rawNext) && rawNext >= 1 && rawNext < 1_000_000 ? rawNext : builds.length + 1;
  return { state: { version: 2, nextNumber: Math.max(nextNumber, builds.length + 1), builds }, skipped };
}

/**
 * Converts the v1 format (prices as euro floats, array at the top level) to the v2 state.
 * Returns null if the value is not an array.
 */
export function migrateLegacy(value: unknown): { state: SavedState; skipped: number } | null {
  if (!Array.isArray(value)) return null;
  const builds: SavedBuild[] = [];
  const seen = new Set<string>();
  let skipped = 0;
  for (const item of value) {
    const converted = convertLegacyBuild(item);
    if (!converted || seen.has(converted.id)) {
      skipped += 1;
      continue;
    }
    seen.add(converted.id);
    builds.push(converted);
  }
  return { state: { version: 2, nextNumber: value.length + 1, builds }, skipped };
}

function convertLegacyBuild(value: unknown): SavedBuild | null {
  if (!isRecord(value) || !isRecord(value["parts"])) return null;
  const parts: Record<string, unknown> = {};
  for (const part of PARTS) {
    const raw = value["parts"][part];
    if (!isRecord(raw)) continue;
    const euros = Number(raw["price"]);
    const model = typeof raw["model"] === "string" ? raw["model"].slice(0, MODEL_MAX_LENGTH) : "";
    if (!Number.isFinite(euros) || euros < 0) return null;
    parts[part] = { model, priceCents: Math.min(Math.round(euros * 100), MAX_PRICE_CENTS) };
  }
  const name = typeof value["name"] === "string" ? value["name"].slice(0, NAME_MAX_LENGTH) : "Imported build";
  return parseSavedBuild({ id: value["id"], name, savedAt: value["savedAt"], parts });
}

const UNREADABLE = "Saved builds were unreadable and were ignored.";

function tryParseJson(raw: string): { ok: true; value: unknown } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(raw) as unknown };
  } catch {
    return { ok: false };
  }
}

export function loadState(storage: StorageLike): LoadResult {
  let raw: string | null;
  let legacyRaw: string | null = null;
  try {
    raw = storage.getItem(STORAGE_KEY);
    if (raw === null) legacyRaw = storage.getItem(LEGACY_STORAGE_KEY);
  } catch {
    return { state: emptyState(), skipped: 0, error: "Saved builds could not be read from this browser." };
  }

  if (raw !== null) {
    const json = tryParseJson(raw);
    const parsed = json.ok ? parseState(json.value) : null;
    return parsed ? { ...parsed, error: null } : { state: emptyState(), skipped: 0, error: UNREADABLE };
  }

  if (legacyRaw !== null) {
    const json = tryParseJson(legacyRaw);
    const migrated = json.ok ? migrateLegacy(json.value) : null;
    return migrated ? { ...migrated, error: null } : { state: emptyState(), skipped: 0, error: UNREADABLE };
  }

  return { state: emptyState(), skipped: 0, error: null };
}

export function saveState(storage: StorageLike, state: SavedState): SaveResult {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { ok: true };
  } catch {
    return { ok: false, error: "This browser blocked or filled its local storage, so nothing was saved." };
  }
}

/** Default name for a new build, taken from the monotonic counter. */
export function defaultName(state: SavedState): string {
  return `Build ${state.nextNumber}`;
}

export interface AddInput {
  id: string;
  name: string;
  savedAt: string;
  parts: Build;
}

/** Pure: returns a new state with the build added at the top. Returns null if no part is filled. */
export function addBuild(state: SavedState, input: AddInput): SavedState | null {
  if (filledParts(input.parts).length === 0) return null;
  const name = input.name.trim().slice(0, NAME_MAX_LENGTH) || defaultName(state);
  const saved: SavedBuild = {
    id: input.id,
    name,
    savedAt: input.savedAt,
    totalCents: totalCents(input.parts),
    parts: input.parts
  };
  return { ...state, nextNumber: state.nextNumber + 1, builds: [saved, ...state.builds] };
}

export function removeBuild(state: SavedState, id: string): SavedState {
  return { ...state, builds: state.builds.filter((item) => item.id !== id) };
}

export function clearBuilds(state: SavedState): SavedState {
  return { ...state, builds: [] };
}

export const THEMES = ["light", "dark", "contrast"] as const;
export type Theme = (typeof THEMES)[number];

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

export function loadTheme(storage: StorageLike, prefersDark: boolean): Theme {
  try {
    const stored = storage.getItem(THEME_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    /* fall through to the default */
  }
  return prefersDark ? "dark" : "light";
}

export function saveTheme(storage: StorageLike, theme: Theme): void {
  try {
    storage.setItem(THEME_KEY, theme);
  } catch {
    /* theme just will not persist */
  }
}
