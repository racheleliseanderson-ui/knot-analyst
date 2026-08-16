import { expect, test, type Page } from "@playwright/test";

/**
 * The printable card is the artefact that leaves the app — it must survive
 * print media (control chrome dropped, findings kept), fire the print call,
 * and export a real PDF file. Verified after a Decide run and after a
 * Diagnose run.
 */

/** Record window.print() calls instead of opening the OS dialog. */
async function stubPrint(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __printed: number }).__printed = 0;
    window.print = () => {
      (window as unknown as { __printed: number }).__printed += 1;
    };
  });
}

const printCount = (page: Page) =>
  page.evaluate(() => (window as unknown as { __printed: number }).__printed);

test.describe("Printable decision card", () => {
  test.beforeEach(async ({ page }) => {
    await stubPrint(page);
  });

  test("renders, survives print media, and prints after a Decide run", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto("/");
    await page.getByRole("button", { name: /^Load scenario:/ }).first().click();

    const card = page.getByText("Knot decision card");
    await expect(card).toBeVisible();
    // The card must carry a verdict and a field-fit number, not just a shell.
    await expect(page.getByText(/\d+%/).first()).toBeVisible();

    const printButton = page.getByRole("button", { name: /^print$/i }).first();
    await expect(printButton).toBeVisible();

    // Print media: the findings stay, the interactive chrome is dropped.
    await page.emulateMedia({ media: "print" });
    await expect(card).toBeVisible();
    await expect(page.locator(".no-print").first()).toBeHidden();
    await page.emulateMedia({ media: "screen" });

    await printButton.click();
    expect(await printCount(page)).toBe(1);
    expect(errors).toEqual([]);
  });

  test("exports a brief and a field packet PDF after a Decide run", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /^Load scenario:/ }).first().click();
    await expect(page.getByText("Knot decision card")).toBeVisible();

    for (const label of [/^Brief PDF/, /^Field packet PDF/]) {
      const trigger = page.getByRole("button", { name: label }).first();
      await expect(trigger).toBeEnabled();
      const download = page.waitForEvent("download", { timeout: 30_000 });
      await trigger.click();
      const file = await download;
      expect(file.suggestedFilename()).toMatch(/\.pdf$/i);
      expect(await file.path()).toBeTruthy();
      // A failed build swaps the label to "Retry …" — the export must not fail.
      await expect(page.getByRole("button", { name: /^retry /i })).toHaveCount(0);
    }
  });

  test("renders, survives print media, and prints after a Diagnose run", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto("/diagnose");
    await page.getByRole("button", { name: /let go at the join/i }).first().click();

    const card = page.getByText("Diagnosis card");
    await expect(card).toBeVisible();
    await expect(page.getByRole("heading", { level: 2 }).first()).toBeVisible();

    const printButton = page.getByRole("button", { name: /^print$/i }).first();
    await expect(printButton).toBeVisible();

    await page.emulateMedia({ media: "print" });
    await expect(card).toBeVisible();
    await expect(printButton).toBeHidden();
    await page.emulateMedia({ media: "screen" });

    await printButton.click();
    expect(await printCount(page)).toBe(1);
    expect(errors).toEqual([]);
  });
});
