import { expect, test, type Page } from "@playwright/test";

const failOnPageErrors = (page: Page, sink: string[]) => {
  page.on("pageerror", (error) => sink.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("Failed to load resource")) {
      sink.push(message.text());
    }
  });
};

test.describe("Knot use cases", () => {
  test("lists practical use cases without exposing the old theory atlas", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/applications/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/where each knot fits/i);
    await expect(page.getByText(/what this section answers/i)).toBeVisible();
    await expect(page.getByText(/dna topology/i)).toHaveCount(0);
    await expect(page.getByText(/quantum/i)).toHaveCount(0);
    await expect(page.getByText(/use-case notes/i)).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("a knot use case opens its guide and tying steps", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/applications/");
    await page.getByRole("radio", { name: /boating/i }).click();
    await page.getByRole("link", { name: /bowline/i }).first().click();
    await expect(page).toHaveURL(/\/applications\/bowline$/);
    await expect(page.getByRole("heading", { name: "Bowline" })).toBeVisible();
    await expect(page.getByText(/best use/i).first()).toBeVisible();
    await expect(page.getByText(/tradeoffs/i).first()).toBeVisible();

    await page.getByRole("link", { name: /how to tie it/i }).click();
    await expect(page).toHaveURL(/\/tie\/bowline/);
    expect(errors).toEqual([]);
  });

  test("fishing discipline shows practical knot cards", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/applications/");
    await expect(page.locator("article").filter({ hasText: "Palomar Knot" }).first()).toBeVisible();
    await expect(page.locator("article").filter({ hasText: "FG" }).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("boating discipline lists rope classes and hides fishing terminals", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/applications/");
    await page.getByRole("radio", { name: /boating/i }).click();
    await expect(page.locator("article").filter({ hasText: "Bowline" }).first()).toBeVisible();
    await expect(page.locator("article").filter({ hasText: "Cleat Hitch" }).first()).toBeVisible();
    await expect(page.locator("article").filter({ hasText: "Palomar Knot" })).toHaveCount(0);
    expect(errors).toEqual([]);
  });
});
