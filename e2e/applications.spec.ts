import { expect, test, type Page } from "@playwright/test";

/**
 * Applications (mode 07).
 * Contract: theory atlas is browsable without a Decide form, world essays
 * never score, and every modelled connection has a note that opens plates
 * and the step player.
 */

const failOnPageErrors = (page: Page, sink: string[]) => {
  page.on("pageerror", (e) => sink.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().includes("Failed to load resource")) {
      sink.push(m.text());
    }
  });
};

test.describe("Applications", () => {
  test("lists the world atlas and knot notes without running Decide", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/applications");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/where the theory applies/i);
    await expect(page.getByText(/does not run decide/i).first()).toBeVisible();
    await expect(page.getByText("Knot decision card")).toHaveCount(0);
    await expect(page.getByText(/physical hitch theory/i).first()).toBeVisible();
    await expect(page.getByText(/dna topology/i).first()).toBeVisible();
    await expect(page.getByText(/\d+ of \d+ knots/i)).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("a connection note opens plates and the step player", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/applications");
    await page.getByRole("radio", { name: /boating/i }).click();
    await page
      .getByRole("link", { name: /bowline/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/applications\/bowline$/);
    await expect(page.getByRole("heading", { name: "Bowline" })).toBeVisible();
    await expect(page.getByText(/same crossing pattern/i).first()).toBeVisible();
    await expect(page.getByText(/does not pick a knot/i).first()).toBeVisible();

    await page.getByRole("link", { name: /how to tie it/i }).click();
    await expect(page).toHaveURL(/\/tie\/bowline/);
    expect(errors).toEqual([]);
  });

  test("a world essay stays isolated and can name modelled duals", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/applications");
    await page.getByRole("link", { name: /dna topology/i }).click();
    await expect(page).toHaveURL(/\/applications\/dna-topology$/);
    await expect(page.getByRole("heading", { name: /dna topology/i })).toBeVisible();
    await expect(page.getByText(/does not tell you which fishing knot/i)).toBeVisible();
    await expect(page.getByText(/not about a fishing or boat knot/i)).toBeVisible();

    await page.goto("/applications");
    await page.getByRole("link", { name: /physical hitch theory/i }).click();
    await expect(page).toHaveURL(/\/applications\/physical-hitches/);
    await expect(page.getByRole("link", { name: /cleat hitch/i })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("boating discipline lists rope classes and hides fishing terminals", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/applications");
    await page.getByRole("radio", { name: /boating/i }).click();
    await expect(page.locator("article").filter({ hasText: "Bowline" }).first()).toBeVisible();
    await expect(page.locator("article").filter({ hasText: "Cleat Hitch" }).first()).toBeVisible();
    await expect(page.locator("article").filter({ hasText: "Palomar Knot" })).toHaveCount(0);
    expect(errors).toEqual([]);
  });
});
