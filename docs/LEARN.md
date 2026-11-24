# Learning notes

Short explanations of the ideas this project actually uses, and why they matter. Each one points at a file.

## Prices are integer cents

A PC build is a sum of many prices. If those prices are stored as floats, `0.1 + 0.2` errors add up and a total can be a cent off. Every price in BuildRig is an integer number of cents. `parsePriceToCents` in `src/lib/money.ts` reads the typed string directly (`"349,99"` becomes 34999) so no floating point is involved. Display uses `Intl.NumberFormat` only at the edge. The saved total is always recomputed from the parts, never trusted from storage.

See `src/lib/money.ts` and `parseSavedBuild` in `src/lib/storage.ts`.

## v1 to v2 storage migration

The first saved-build format used euro floats and a bare array under `buildrig.savedBuilds.v1`. The current format (`buildrig.savedBuilds.v2`) is a versioned object: integer cents, a monotonic `nextNumber` for names, and validation that skips a bad build instead of dropping the whole list. On load, `loadState` reads v2 first; if that key is missing it looks at the v1 key and runs `migrateLegacy`, which converts each `price` in euros to cents. Old data keeps working, and a broken v1 entry is skipped rather than wiping the rest.

See `migrateLegacy` and `loadState` in `src/lib/storage.ts`.

## Confirmations wrap destructive actions

Delete, clear-all, reset, and loading an example over a filled calculator cannot be undone from inside the app. Those actions go through `confirmAction` in `src/ui/confirm.ts`, which opens a native modal `<dialog>`, focuses Cancel first, and resolves true only if the user confirms. Escape or closing the dialog cancels. The rest of the UI stays unchanged until that promise returns true.

See `src/ui/confirm.ts` and the call sites in `src/main.ts`.
