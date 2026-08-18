import { expect, test, type Page } from "@playwright/test";

/**
 * Library (mode 05) and diagram plates (mode 06).
 * Contract: the modelled catalogue is browsable without a Decide form,
 * domain isolation holds, and every card opens plates + the step player.
 */

const failOnPageErrors = (page: Page, sink: string[]) => {
  page.on("pageerror", (e) => sink.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().includes("Failed to load resource")) {
      sink.push(m.text());
    }
  });
};

test.describe("Library", () => {
  test("lists the modelled catalogue without a Decide form", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/library");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/modelled connections/i);
    await expect(page.getByText(/decide form/i)).toBeVisible();
    await expect(page.getByText("Knot decision card")).toHaveCount(0);
    await expect(page.getByText(/\d+ here/i)).toBeVisible();
    await expect(page.getByText(/\d+ modelled/i)).toBeVisible();

    const cards = page.locator("article");
    expect(await cards.count()).toBeGreaterThan(40);
    await expect(page.getByText("Palomar Knot").first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("search and job chips filter the list, and deep links restore the filter", async ({
    page,
  }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/library");
    const box = page.getByPlaceholder(/search palomar/i);
    await box.fill("palomar");
    await expect(page.getByText("Palomar Knot").first()).toBeVisible();
    await expect(page.getByText("Improved Clinch")).toHaveCount(0);

    await page.goto("/library?q=fg");
    await expect(page.getByText(/FG Knot/i).first()).toBeVisible();

    await page.goto("/library?job=line-to-line");
    await expect(page.getByRole("button", { name: /line-to-line/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(await page.locator("article").count()).toBeGreaterThan(3);
    expect(errors).toEqual([]);
  });

  test("a card opens diagrams, then the step player", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/library?q=palomar");
    await page
      .getByRole("link", { name: /Palomar Knot/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/diagram\/palomar/);
    await expect(page.getByRole("heading", { name: "Palomar Knot" })).toBeVisible();
    await expect(page.getByText("Finished structure")).toBeVisible();
    await expect(page.getByText(/^Step 01$/)).toBeVisible();

    await page.getByRole("link", { name: /open step player/i }).click();
    await expect(page).toHaveURL(/\/tie\/palomar/);
    await expect(page.getByRole("link", { name: /all diagrams/i })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("boating discipline lists rope work and hides fishing terminals", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/library");
    await page.getByRole("radio", { name: /boating/i }).click();
    await expect(page.getByText("Bowline").first()).toBeVisible();
    await expect(page.getByText("Cleat Hitch").first()).toBeVisible();
    await expect(page.getByText("Palomar Knot")).toHaveCount(0);
    await expect(page.getByText(/rope work/i).first()).toBeVisible();
    expect(errors).toEqual([]);
  });
});
