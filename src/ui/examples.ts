import { formatCents } from "../lib/money";
import { PRICE_NOTE, presetToBuild, presetTotalCents, type Preset } from "../lib/presets";
import { RUMOURS, RUMOUR_NOTE } from "../lib/rumours";
import { el } from "./dom";

const KEY_PARTS = ["CPU", "GPU", "RAM"] as const;

/** Shows what a preset is for, why it was chosen, its total and its key parts. */
export function renderPresetInfo(container: HTMLElement, preset: Preset | undefined): void {
  if (!preset) {
    container.replaceChildren(el("p", { class: "muted" }, "Choose an example to see what it is for, its key parts and its total."));
    return;
  }
  const build = presetToBuild(preset);
  const keyParts = el("dl", { class: "preset-key-parts" });
  for (const part of KEY_PARTS) {
    const entry = build[part];
    keyParts.append(el("dt", {}, part), el("dd", {}, entry.model));
  }
  const notes = el("ul", { class: "preset-notes" }, ...preset.notes.map((note) => el("li", {}, note)));
  container.replaceChildren(
    el(
      "div",
      { class: "preset-card" },
      el(
        "header",
        {},
        el("div", {}, el("h4", {}, preset.name), el("p", { class: "preset-purpose" }, preset.purpose)),
        el("strong", { class: "preset-total", "aria-label": `Total ${formatCents(presetTotalCents(preset))}` }, formatCents(presetTotalCents(preset)))
      ),
      el("p", {}, el("strong", {}, "Why: "), preset.why),
      keyParts,
      notes,
      el("p", { class: "preset-price-note" }, PRICE_NOTE)
    )
  );
}

/** Info list of reported upcoming hardware. No prices, always labelled as rumoured. */
export function renderRumours(note: HTMLElement, list: HTMLElement): void {
  note.textContent = RUMOUR_NOTE;
  list.replaceChildren(
    ...RUMOURS.map((rumour) => {
      const links = el("span", { class: "rumour-sources" }, "Sources: ");
      rumour.sources.forEach((source, index) => {
        if (index > 0) links.append(", ");
        links.append(el("a", { href: source.url, target: "_blank", rel: "noopener noreferrer" }, source.label));
      });
      return el("li", { class: "rumour" }, el("strong", {}, rumour.title), el("p", {}, rumour.summary), el("p", { class: "muted" }, links));
    })
  );
}
