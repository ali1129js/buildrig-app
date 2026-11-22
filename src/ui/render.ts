import { filledParts, type Build } from "../lib/build";
import { compareBuilds } from "../lib/compare";
import { formatCents, formatDeltaCents } from "../lib/money";
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
        { role: "row" },
        el("th", { scope: "row", role: "rowheader" }, part),
        el("td", { class: hasModel ? "" : "empty", role: "cell" }, hasModel ? entry.model : EMPTY_MODEL_LABEL),
        el("td", { class: "num", role: "cell" }, formatCents(entry.priceCents))
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

export interface CompareHandlers {
  onChange: (leftId: string, rightId: string) => void;
  onLoad: (id: string) => void;
}

export function renderCompare(
  container: HTMLElement,
  builds: readonly SavedBuild[],
  leftId: string | null,
  rightId: string | null,
  handlers: CompareHandlers
): void {
  if (builds.length < 2) {
    container.replaceChildren(
      el(
        "p",
        { class: "compare-hint muted" },
        "Save at least two builds to compare them part by part. Picking builds here does not change the calculator."
      )
    );
    return;
  }

  const left = builds.find((item) => item.id === leftId) ?? builds[0]!;
  const right = builds.find((item) => item.id === rightId) ?? builds.find((item) => item.id !== left.id) ?? builds[1]!;
  const cmp = compareBuilds(left, right);

  const leftSelect = el("select", { id: "compareLeft", "aria-label": "Build A" }) as HTMLSelectElement;
  const rightSelect = el("select", { id: "compareRight", "aria-label": "Build B" }) as HTMLSelectElement;
  for (const build of builds) {
    const optionLabel = `${build.name} (${formatCents(build.totalCents)})`;
    leftSelect.append(el("option", { value: build.id }, optionLabel));
    rightSelect.append(el("option", { value: build.id }, optionLabel));
  }
  leftSelect.value = left.id;
  rightSelect.value = right.id;
  const onPick = () => handlers.onChange(leftSelect.value, rightSelect.value);
  leftSelect.addEventListener("change", onPick);
  rightSelect.addEventListener("change", onPick);

  const head = el(
    "thead",
    {},
    el(
      "tr",
      { role: "row" },
      el("th", { scope: "col", role: "columnheader" }, "Part"),
      el("th", { scope: "col", role: "columnheader" }, `${left.name} model`),
      el("th", { scope: "col", class: "num", role: "columnheader" }, `${left.name} price`),
      el("th", { scope: "col", role: "columnheader" }, `${right.name} model`),
      el("th", { scope: "col", class: "num", role: "columnheader" }, `${right.name} price`),
      el("th", { scope: "col", class: "num", role: "columnheader" }, "Delta")
    )
  );

  const body = el("tbody", { role: "rowgroup" });
  for (const row of cmp.parts) {
    const leftModel = row.left.model.trim() !== "" ? row.left.model : EMPTY_MODEL_LABEL;
    const rightModel = row.right.model.trim() !== "" ? row.right.model : EMPTY_MODEL_LABEL;
    body.append(
      el(
        "tr",
        { role: "row", class: row.bothEmpty ? "compare-empty" : undefined },
        el("th", { scope: "row", role: "rowheader" }, row.part),
        el("td", { class: row.left.model.trim() !== "" ? "" : "empty", role: "cell" }, leftModel),
        el("td", { class: "num", role: "cell" }, formatCents(row.left.priceCents)),
        el("td", { class: row.right.model.trim() !== "" ? "" : "empty", role: "cell" }, rightModel),
        el("td", { class: "num", role: "cell" }, formatCents(row.right.priceCents)),
        el("td", { class: "num", role: "cell" }, formatDeltaCents(row.deltaCents))
      )
    );
  }

  const foot = el(
    "tfoot",
    {},
    el(
      "tr",
      { role: "row" },
      el("th", { scope: "row", role: "rowheader" }, "Total"),
      el("td", { role: "cell" }, ""),
      el("td", { class: "num", role: "cell" }, formatCents(left.totalCents)),
      el("td", { role: "cell" }, ""),
      el("td", { class: "num", role: "cell" }, formatCents(right.totalCents)),
      el("td", { class: "num", role: "cell" }, formatDeltaCents(cmp.totalDeltaCents))
    )
  );

  const table = el(
    "table",
    { class: "compare-table" },
    el(
      "caption",
      {},
      `Part-by-part comparison. Delta is ${right.name} minus ${left.name}.`
    ),
    head,
    body,
    foot
  );

  const loadLeft = el("button", { class: "btn btn-primary", type: "button", "aria-label": `Load ${left.name}` }, `Load ${left.name}`);
  loadLeft.addEventListener("click", () => handlers.onLoad(left.id));
  const loadRight = el("button", { class: "btn btn-primary", type: "button", "aria-label": `Load ${right.name}` }, `Load ${right.name}`);
  loadRight.addEventListener("click", () => handlers.onLoad(right.id));

  container.replaceChildren(
    el("h4", { class: "compare-title", id: "compareTitle" }, "Compare two builds"),
    el(
      "p",
      { class: "muted" },
      "Choose two saved builds to see each part's model, price, and the price difference. This does not change the calculator until you load a build."
    ),
    el(
      "div",
      { class: "compare-pickers" },
      el("div", { class: "field" }, el("label", { for: "compareLeft" }, "Build A"), leftSelect),
      el("div", { class: "field" }, el("label", { for: "compareRight" }, "Build B"), rightSelect)
    ),
    el("div", { class: "table-wrap compare-wrap" }, table),
    el("div", { class: "saved-card-actions" }, loadLeft, loadRight)
  );
}
