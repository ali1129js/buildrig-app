import { el } from "./dom";

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
}

/** Accessible confirmation using a native modal <dialog>. Resolves true only on confirm. */
export function confirmAction(options: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const cancel = el("button", { class: "btn btn-ghost", type: "button", value: "cancel" }, "Cancel");
    const ok = el("button", { class: "btn btn-secondary", type: "button", value: "confirm" }, options.confirmLabel);
    const titleId = "confirm-title";
    const dialog = el(
      "dialog",
      { class: "confirm", "aria-labelledby": titleId },
      el("h2", { id: titleId }, options.title),
      el("p", {}, options.message),
      el("div", { class: "toolbar" }, ok, cancel)
    );
    let result = false;
    ok.addEventListener("click", () => {
      result = true;
      dialog.close();
    });
    cancel.addEventListener("click", () => dialog.close());
    dialog.addEventListener("close", () => {
      dialog.remove();
      resolve(result);
    });
    document.body.append(dialog);
    dialog.showModal();
    cancel.focus();
  });
}
