import { filledParts, type Build } from "../lib/build";
import { formatCents } from "../lib/money";
import { PARTS, type PartName } from "../lib/parts";
import type { SavedBuild } from "../lib/storage";
import { el } from "./dom";

export const EMPTY_MODEL_LABEL = "Not set";

export function renderNav(container: HTMLElement, build: Build, active: PartName, onSelect: (part: PartName) => void): void {
  container.replaceChildren(
    ...PARTS.map((part) => {
      const entry = build[part];
      const button = el(
        "button",
        { type: "button", class: "part-tab", "data-part": part, "aria-current": part === active ? "true" : "false" },
        el("span", {}, part),
        el("small", {}, entry.priceCents > 0 ? formatCents(entry.priceCents) : "Empty")
      );
      button.addEventListener("click", () => onSelect(part));
      return button;
    })
  );
}

export function renderTable(body: HTMLElement, build: Build): void {
  body.replaceChildren(
    ...PARTS.map((part) => {
      const entry = build[part];
      const hasModel = entry.model.trim() !== "";
      return el(
        "tr",
        {},
        el("th", { scope: "row" }, part),
        el("td", { class: hasModel ? "" : "empty" }, hasModel ? entry.model : EMPTY_MODEL_LABEL),
        el("td", { class: "num" }, formatCents(entry.priceCents))
      );
    })
  );
}

export interface SavedCardHandlers {
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatSavedAt(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "Saved build" : date.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

export function renderSavedBuilds(container: HTMLElement, builds: readonly SavedBuild[], handlers: SavedCardHandlers): void {
  if (builds.length === 0) {
    container.replaceChildren(
      el("div", { class: "saved-empty" }, "No saved builds yet. Fill in a component, choose Save build, and it will appear here, even after you refresh the page.")
    );
    return;
  }

  container.replaceChildren(
    ...builds.map((saved) => {
      const filled = filledParts(saved.parts);
      const list = el("dl", {}, el("dt", {}, "Filled parts"), el("dd", {}, String(filled.length)));
      for (const { part, entry } of filled.slice(0, 4)) {
        const model = entry.model.trim() !== "" ? entry.model : EMPTY_MODEL_LABEL;
        list.append(el("dt", {}, part), el("dd", {}, `${model} · ${formatCents(entry.priceCents)}`));
      }

      const load = el("button", { class: "btn btn-primary", type: "button", "aria-label": `Load ${saved.name}` }, "Load build");
      load.addEventListener("click", () => handlers.onLoad(saved.id));
      const remove = el("button", { class: "btn btn-ghost", type: "button", "aria-label": `Delete ${saved.name}` }, "Delete");
      remove.addEventListener("click", () => handlers.onDelete(saved.id));

      return el(
        "article",
        { class: "saved-card" },
        el(
          "header",
          {},
          el("div", {}, el("h4", {}, saved.name), el("p", { class: "muted" }, formatSavedAt(saved.savedAt))),
          el("strong", {}, formatCents(saved.totalCents))
        ),
        list,
        el("div", { class: "saved-card-actions" }, load, remove)
      );
    })
  );
}
