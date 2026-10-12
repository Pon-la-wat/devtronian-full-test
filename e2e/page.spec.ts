import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

async function expectNoSeriousViolations(page: Page) {
  // axe resolves a second copy of the Playwright types, so the Page is cast to its own.
  const axePage = page as unknown as ConstructorParameters<typeof AxeBuilder>[0]["page"];
  const { violations } = await new AxeBuilder({ page: axePage }).analyze();
  const bad = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(bad).toEqual([]);
}

async function expectCentred(page: Page) {
  const box = await page.getByRole("heading", { name: "Hello Devtronian" }).boundingBox();
  const view = page.viewportSize();
  if (!box || !view) throw new Error("missing box or viewport");
  expect(Math.abs(box.x + box.width / 2 - view.width / 2)).toBeLessThanOrEqual(2);
  expect(Math.abs(box.y + box.height / 2 - view.height / 2)).toBeLessThanOrEqual(2);
}

test("[EX-1] opening the page shows a large Hello Devtronian", async ({ page }) => {
  await page.goto("/");
  const heading = page.getByRole("heading", { name: "Hello Devtronian", exact: true });
  await expect(heading).toBeVisible();
  const size = await heading.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBeGreaterThanOrEqual(48);
  await expectNoSeriousViolations(page);
});

test("[EX-2] the text stays centred when the window is resized", async ({ page }) => {
  await page.goto("/");
  for (const [width, height] of [
    [1280, 720],
    [500, 900],
    [1600, 400],
    [320, 480],
  ] as const) {
    await page.setViewportSize({ width, height });
    await expectCentred(page);
    await expectNoSeriousViolations(page);
  }
});

test("[EX-3] the page holds only the text, nothing to tab to", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveText("Hello Devtronian");
  await expect(page.locator("button, nav, img, svg, a, input, select, textarea")).toHaveCount(0);
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(focused).toBe("BODY");
  await expectNoSeriousViolations(page);
});

test("[EX-4] the file opens straight from disk with the network off", async ({ page, context }) => {
  await context.setOffline(true);
  await page.goto(pathToFileURL(resolve(import.meta.dirname, "../index.html")).href);
  await expect(page.getByRole("heading", { name: "Hello Devtronian", exact: true })).toBeVisible();
  await expectCentred(page);
  await expectNoSeriousViolations(page);
});
