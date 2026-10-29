// Optional: headless smoke test and theme screenshots.
// Usage: npm run build && npx vite preview --port 4173 & node scripts/screenshots.mjs <outDir>
// Needs playwright-core (npm i --no-save playwright-core) and a Chromium install.
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const outDir = process.argv[2] ?? "shots";
const url = process.env.APP_URL ?? "http://localhost:4173/";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, locale: "en-GB" });
const page = await context.newPage();
const external = [];
const dialogs = [];
page.on("request", (r) => {
  if (!r.url().startsWith(new URL(url).origin) && !r.url().startsWith("data:")) external.push(r.url());
});
page.on("dialog", (d) => dialogs.push(d.message()));
page.on("pageerror", (e) => console.error("PAGE ERROR", e.message));

const check = (name, ok) => {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}`);
  if (!ok) process.exitCode = 1;
};

async function setPart(part, model, price) {
  await page.selectOption("#componentSelect", part);
  await page.fill("#modelInput", model);
  await page.fill("#priceInput", price);
  await page.click('button[type="submit"]');
}

await page.goto(url);
await setPart("CPU", "Ryzen 7 7800X3D", "349,99");
await setPart("GPU", "<img src=x onerror=\"window.__pwned=1\">RTX 4070", "599.5");
await setPart("RAM", "32 GB DDR5-6000", "119");
await setPart("Case", "Free case", "0");
check("total is 1.068,49 €", (await page.textContent("#totalAmount"))?.replace(/\s/g, " ") === "1.068,49 €");
check("filled count is 4", (await page.textContent("#filledCount")) === "4");
check("average is 267,12 €", (await page.textContent("#averagePrice"))?.replace(/\s/g, " ") === "267,12 €");
check("no injected img/__pwned", (await page.locator("tbody img").count()) === 0 && (await page.evaluate(() => window.__pwned)) === undefined);
check("bad price is rejected with message", await (async () => {
  await page.fill("#priceInput", "12.345");
  await page.click('button[type="submit"]');
  return (await page.textContent("#priceError"))?.includes("Enter a price");
})());
await page.fill("#priceInput", "119");

await page.click("#saveBtn");
await page.fill("#buildNameInput", "Gaming rig");
await page.click("#saveBtn");
await page.reload();
check("saved builds persist after reload", (await page.locator(".saved-card").count()) === 2);
const names = await page.locator(".saved-card h4").allTextContents();
check(`names are ${JSON.stringify(names)}`, names[0] === "Gaming rig" && names[1] === "Build 1");

// Delete asks for confirmation; cancel keeps it, confirm removes it.
await page.getByRole("button", { name: "Delete Gaming rig" }).click();
check("confirm dialog opens", await page.locator("dialog.confirm[open]").isVisible());
await page.screenshot({ path: `${outDir}/confirm-dialog-dark.png` });
await page.getByRole("button", { name: "Cancel" }).click();
check("cancel keeps build", (await page.locator(".saved-card").count()) === 2);
await page.getByRole("button", { name: "Delete Gaming rig" }).click();
await page.locator("dialog.confirm").getByRole("button", { name: "Delete build" }).click();
await page.waitForFunction(() => document.querySelectorAll(".saved-card").length === 1);
check("confirmed delete removes build", (await page.locator(".saved-card").count()) === 1);
await setPart("CPU", "Ryzen 7 7800X3D", "349,99");
await page.click("#saveBtn");
const after = await page.locator(".saved-card h4").allTextContents();
check(`name after delete does not collide: ${JSON.stringify(after)}`, after[0] === "Build 3" && after[1] === "Build 1");
await page.fill("#buildNameInput", "Gaming rig");
await page.click("#saveBtn");

await page.click("#clearSavedBtn");
await page.locator("dialog.confirm").getByRole("button", { name: "Cancel" }).click();
check("clear cancelled keeps builds", (await page.locator(".saved-card").count()) === 3);

// Corrupt storage is handled.
await page.evaluate(() => localStorage.setItem("buildrig.savedBuilds.v2", "{oops"));
await page.reload();
check("corrupt storage shows message and empty list", (await page.textContent("#status"))?.includes("unreadable") && (await page.locator(".saved-card").count()) === 0);
await page.evaluate(() => localStorage.removeItem("buildrig.savedBuilds.v2"));
await page.reload();
await setPart("CPU", "Ryzen 7 7800X3D", "349,99");
await setPart("GPU", "RTX 4070", "599,50");
await setPart("RAM", "32 GB DDR5-6000", "119");
await setPart("Motherboard", "B650 Tomahawk", "199,90");
await page.click("#saveBtn");
await page.fill("#buildNameInput", "Budget build");
await setPart("Primary SSD", "1 TB NVMe", "69,99");
await page.click("#saveBtn");

for (const theme of ["light", "dark", "contrast"]) {
  await page.selectOption("#themeSelect", theme);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${outDir}/theme-${theme}.png`, fullPage: true });
}
await page.reload();
check("theme persists after reload", (await page.getAttribute("html", "data-theme")) === "contrast");

// Example builds: preview, confirm when the build has data, saved builds untouched.
const savedBefore = await page.locator(".saved-card").count();
check("load button is disabled until an example is chosen", await page.locator("#loadPresetBtn").isDisabled());
await page.selectOption("#presetSelect", "gaming-4k");
check("preview shows purpose, total and price note", await (async () => {
  const text = (await page.textContent("#presetInfo"))?.replace(/\s/g, " ") ?? "";
  return text.includes("High-end gaming at 4K") && text.includes("4.406,70 €") && text.includes("Prices as of Oct 2026, check retailers.");
})());
check("preview alone does not change the build", (await page.textContent("#filledCount")) === "0");
await page.click("#loadPresetBtn");
check("empty build loads without a confirm dialog", (await page.locator("dialog.confirm").count()) === 0 && (await page.textContent("#filledCount")) === "11");
check("total is 4.406,70 €", (await page.textContent("#totalAmount"))?.replace(/\s/g, " ") === "4.406,70 €");
check("status mentions the price note", (await page.textContent("#status"))?.includes("Prices as of Oct 2026, check retailers.") === true);
check("saved builds untouched after load", (await page.locator(".saved-card").count()) === savedBefore);

await page.selectOption("#presetSelect", "compact-quiet");
await page.click("#loadPresetBtn");
check("confirm dialog opens when the build has data", await page.locator("dialog.confirm[open]").isVisible());
await page.locator("dialog.confirm").getByRole("button", { name: "Cancel" }).click();
await page.waitForFunction(() => document.querySelectorAll("dialog.confirm").length === 0);
check("cancel keeps the current build", (await page.textContent("#totalAmount"))?.replace(/\s/g, " ") === "4.406,70 €");
await page.click("#loadPresetBtn");
await page.locator("dialog.confirm").getByRole("button", { name: "Load example" }).click();
await page.waitForFunction(() => document.getElementById("totalAmount")?.textContent?.includes("1.127,55"));
check("confirm replaces the build", (await page.textContent("#filledCount")) === "9");
check("saved builds still untouched", (await page.locator(".saved-card").count()) === savedBefore);
check("saved storage unchanged by loading", await page.evaluate((n) => JSON.parse(localStorage.getItem("buildrig.savedBuilds.v2") ?? "{}").builds?.length === n, savedBefore));

for (const preset of ["gaming-budget", "dev-workstation", "local-ai", "content-creation"]) {
  await page.selectOption("#presetSelect", preset);
  await page.click("#loadPresetBtn");
  await page.locator("dialog.confirm").getByRole("button", { name: "Load example" }).click();
  await page.waitForFunction(() => document.querySelectorAll("dialog.confirm").length === 0);
}
await page.selectOption("#presetSelect", "gaming-4k");
await page.click("#loadPresetBtn");
await page.locator("dialog.confirm").getByRole("button", { name: "Load example" }).click();
await page.waitForFunction(() => document.getElementById("totalAmount")?.textContent?.includes("4.406,70"));
await page.locator(".rumours-panel details").evaluate((d) => (d.open = true));
check("rumours section is labelled rumoured and has no euro amounts", await (async () => {
  const text = (await page.textContent(".rumours-panel")) ?? "";
  return text.includes("Coming 2027 (rumoured)") && text.includes("Rumoured") && !text.includes("€");
})());
check("no em or en dashes in page text", !/[\u2013\u2014]/.test((await page.textContent("body")) ?? ""));
for (const theme of ["dark", "light", "contrast"]) {
  await page.selectOption("#themeSelect", theme);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${outDir}/preset-loaded-${theme}.png`, fullPage: true });
}

const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mp = await mobile.newPage();
await mp.goto(url);
await mp.selectOption("#themeSelect", "dark");
await mp.screenshot({ path: `${outDir}/mobile-dark.png`, fullPage: true });

check("no external requests", external.length === 0);
check("no native alert/confirm dialogs used", dialogs.length === 0);
await browser.close();
