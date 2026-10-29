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
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mp = await mobile.newPage();
await mp.goto(url);
await mp.selectOption("#themeSelect", "dark");
await mp.screenshot({ path: `${outDir}/mobile-dark.png`, fullPage: true });

check("no external requests", external.length === 0);
check("no native alert/confirm dialogs used", dialogs.length === 0);
await browser.close();
