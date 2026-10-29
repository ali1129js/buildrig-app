import "./styles/themes.css";
import "./styles/app.css";
import { cloneBuild, emptyBuild, filledParts, summarize, type Build } from "./lib/build";
import { centsToInputValue, formatCents, parsePriceToCents } from "./lib/money";
import { isPartName, MODEL_MAX_LENGTH, PARTS, type PartName } from "./lib/parts";
import {
  addBuild,
  clearBuilds,
  defaultName,
  isTheme,
  loadState,
  loadTheme,
  removeBuild,
  saveState,
  saveTheme,
  type SavedState,
  type Theme
} from "./lib/storage";
import { getPreset, PRESETS, PRICE_NOTE, presetToBuild, presetTotalCents } from "./lib/presets";
import { confirmAction } from "./ui/confirm";
import { byId, el } from "./ui/dom";
import { renderPresetInfo, renderRumours } from "./ui/examples";
import { renderNav, renderSavedBuilds, renderTable } from "./ui/render";

/** Storage can throw just by being accessed (blocked cookies), so resolve it defensively. */
function getStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const noStorage: Pick<Storage, "getItem" | "setItem"> = {
  getItem: () => {
    throw new Error("storage unavailable");
  },
  setItem: () => {
    throw new Error("storage unavailable");
  }
};

const storage = getStorage() ?? noStorage;

const nav = byId("partsNav", HTMLElement);
const componentSelect = byId("componentSelect", HTMLSelectElement);
const modelInput = byId("modelInput", HTMLInputElement);
const priceInput = byId("priceInput", HTMLInputElement);
const priceError = byId("priceError", HTMLElement);
const tableBody = byId("partsTableBody", HTMLElement);
const totalAmount = byId("totalAmount", HTMLElement);
const activePartName = byId("activePartName", HTMLElement);
const filledCount = byId("filledCount", HTMLElement);
const averagePrice = byId("averagePrice", HTMLElement);
const remainingCount = byId("remainingCount", HTMLElement);
const status = byId("status", HTMLElement);
const savedList = byId("savedBuildsList", HTMLElement);
const buildNameInput = byId("buildNameInput", HTMLInputElement);
const themeSelect = byId("themeSelect", HTMLSelectElement);
const presetSelect = byId("presetSelect", HTMLSelectElement);
const loadPresetBtn = byId("loadPresetBtn", HTMLButtonElement);
const presetInfo = byId("presetInfo", HTMLElement);

let build: Build = emptyBuild();
let activePart: PartName = "CPU";
const loaded = loadState(storage);
let saved: SavedState = loaded.state;

function say(message: string): void {
  status.replaceChildren(el("span", {}, message));
}

function newId(): string {
  const random = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `build-${random}`;
}

function renderAll(): void {
  const summary = summarize(build);
  totalAmount.textContent = formatCents(summary.totalCents);
  filledCount.textContent = String(summary.filled);
  averagePrice.textContent = formatCents(summary.averageCents);
  remainingCount.textContent = String(summary.remaining);
  activePartName.textContent = activePart;
  buildNameInput.placeholder = `Default: ${defaultName(saved)}`;
  renderNav(nav, build, activePart, (part) => selectPart(part, true));
  renderTable(tableBody, build);
}

function renderSaved(): void {
  renderSavedBuilds(savedList, saved.builds, { onLoad: loadBuild, onDelete: deleteBuild });
  buildNameInput.placeholder = `Default: ${defaultName(saved)}`;
}

function selectPart(part: PartName, focusModel: boolean): void {
  activePart = part;
  componentSelect.value = part;
  const entry = build[part];
  modelInput.value = entry.model;
  priceInput.value = centsToInputValue(entry.priceCents);
  clearPriceError();
  renderAll();
  if (focusModel) modelInput.focus();
}

function clearPriceError(): void {
  priceError.textContent = "";
  priceInput.removeAttribute("aria-invalid");
}

function persist(next: SavedState, successMessage: string): void {
  const result = saveState(storage, next);
  if (!result.ok) {
    say(result.error);
    return;
  }
  saved = next;
  renderSaved();
  say(successMessage);
}

function loadBuild(id: string): void {
  const found = saved.builds.find((item) => item.id === id);
  if (!found) return;
  build = cloneBuild(found.parts);
  selectPart("CPU", false);
  say(`Loaded ${found.name} into the calculator.`);
}

async function deleteBuild(id: string): Promise<void> {
  const found = saved.builds.find((item) => item.id === id);
  if (!found) return;
  const ok = await confirmAction({
    title: "Delete this saved build?",
    message: `${found.name} will be removed from this browser. This cannot be undone.`,
    confirmLabel: "Delete build"
  });
  if (!ok) return;
  persist(removeBuild(saved, id), `Deleted ${found.name} from local storage.`);
}

byId("buildForm", HTMLFormElement).addEventListener("submit", (event) => {
  event.preventDefault();
  const part = componentSelect.value;
  if (!isPartName(part)) return;
  const model = modelInput.value.trim().slice(0, MODEL_MAX_LENGTH);
  const rawPrice = priceInput.value.trim();
  const priceCents = rawPrice === "" ? 0 : parsePriceToCents(rawPrice);
  if (priceCents === null) {
    priceError.textContent = "Enter a price like 349,99 or 349.99 (up to 9999999,99).";
    priceInput.setAttribute("aria-invalid", "true");
    priceInput.focus();
    return;
  }
  build = { ...build, [part]: { model, priceCents } };
  selectPart(part, false);
  say(model === "" && priceCents === 0 ? `Cleared ${part}.` : `Updated ${part}.`);
});

componentSelect.addEventListener("change", () => {
  if (isPartName(componentSelect.value)) selectPart(componentSelect.value, false);
});

function showPresetInfo(): void {
  const preset = getPreset(presetSelect.value);
  loadPresetBtn.disabled = preset === undefined;
  renderPresetInfo(presetInfo, preset);
}

presetSelect.addEventListener("change", showPresetInfo);

loadPresetBtn.addEventListener("click", async () => {
  const preset = getPreset(presetSelect.value);
  if (!preset) return;
  if (filledParts(build).length > 0) {
    const ok = await confirmAction({
      title: "Replace the current build?",
      message: `Loading "${preset.name}" replaces the parts in the calculator. Saved builds are not affected.`,
      confirmLabel: "Load example"
    });
    if (!ok) return;
  }
  build = presetToBuild(preset);
  selectPart("CPU", false);
  say(`Loaded the example "${preset.name}" (${formatCents(presetTotalCents(preset))}). Your saved builds are untouched. ${PRICE_NOTE}`);
});

byId("resetBtn", HTMLButtonElement).addEventListener("click", async () => {
  if (filledParts(build).length > 0) {
    const ok = await confirmAction({
      title: "Reset the current build?",
      message: "All parts you have entered will be cleared. Saved builds are not affected.",
      confirmLabel: "Reset build"
    });
    if (!ok) return;
  }
  build = emptyBuild();
  selectPart("CPU", false);
  say("Build reset. Your saved builds are untouched.");
});

byId("saveBtn", HTMLButtonElement).addEventListener("click", () => {
  const next = addBuild(saved, {
    id: newId(),
    name: buildNameInput.value,
    savedAt: new Date().toISOString(),
    parts: cloneBuild(build)
  });
  if (!next) {
    say("Add at least one component before saving a build.");
    return;
  }
  const count = filledParts(build).length;
  const name = next.builds[0]?.name ?? "build";
  persist(next, `Saved ${name} with ${count} ${count === 1 ? "part" : "parts"} to this browser's local storage. It stays after a refresh.`);
  if (next === saved) buildNameInput.value = "";
});

byId("clearSavedBtn", HTMLButtonElement).addEventListener("click", async () => {
  if (saved.builds.length === 0) {
    say("There are no saved builds to clear.");
    return;
  }
  const count = saved.builds.length;
  const ok = await confirmAction({
    title: "Clear all saved builds?",
    message: `${count} saved ${count === 1 ? "build" : "builds"} will be removed from this browser. This cannot be undone.`,
    confirmLabel: "Clear all"
  });
  if (!ok) return;
  persist(clearBuilds(saved), "All saved builds were cleared from local storage.");
});

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
  themeSelect.value = theme;
}

themeSelect.addEventListener("change", () => {
  if (isTheme(themeSelect.value)) {
    applyTheme(themeSelect.value);
    saveTheme(storage, themeSelect.value);
  }
});

presetSelect.append(el("option", { value: "" }, "Choose an example..."));
for (const preset of PRESETS) presetSelect.append(el("option", { value: preset.id }, `${preset.name} (${formatCents(presetTotalCents(preset))})`));
showPresetInfo();
renderRumours(byId("rumourNote", HTMLElement), byId("rumoursList", HTMLElement));
for (const part of PARTS) componentSelect.append(el("option", { value: part }, part));
applyTheme(loadTheme(storage, window.matchMedia("(prefers-color-scheme: dark)").matches));
selectPart("CPU", false);
renderSaved();

if (loaded.error) say(loaded.error);
else if (loaded.skipped > 0) say(`${loaded.skipped} saved ${loaded.skipped === 1 ? "build was" : "builds were"} unreadable and skipped.`);
