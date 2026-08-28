import { expect, test, type Page } from "@playwright/test";

const failOnPageErrors = (page: Page, sink: string[]) => {
  page.on("pageerror", (error) => sink.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("Failed to load resource")) {
      sink.push(message.text());
    }
  });
};

test.describe("Library", () => {
  test("lists the knots without running Decide", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/library");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/the knots/i);
    await expect(page.getByText(/each knot opens to a larger diagram/i)).toBeVisible();
    await expect(page.getByText("Knot decision card")).toHaveCount(0);
    await expect(page.getByText(/\d+ fishing knots/i)).toBeVisible();

    const cards = page.locator("article");
    expect(await cards.count()).toBeGreaterThan(40);
    await expect(cards.filter({ hasText: "Palomar Knot" }).first()).toBeVisible();
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
    await expect(page.locator("article").filter({ hasText: "Palomar Knot" }).first()).toBeVisible();
    await expect(page.locator("article").filter({ hasText: "Improved Clinch" })).toHaveCount(0);

    await page.goto("/library?q=fg");
    await expect(
      page
        .locator("article")
        .filter({ hasText: /FG Knot/i })
        .first(),
    ).toBeVisible();

    await page.goto("/library?job=line-to-line");
    await expect(page.getByRole("button", { name: /line-to-line/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(await page.locator("article").count()).toBeGreaterThan(3);
    expect(errors).toEqual([]);
  });

  test("a card opens the field guide and then the step player", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/library?q=palomar");
    await page.getByRole("link", { name: /Palomar Knot/i }).first().click();
    await expect(page).toHaveURL(/\/diagram\/palomar/);
    await expect(page.getByRole("heading", { name: "Palomar Knot" })).toBeVisible();
    await expect(page.getByText("Finished structure", { exact: true })).toBeVisible();
    await expect(page.getByText(/what to know before you trust this knot/i)).toBeVisible();
    await expect(page.getByText(/line compatibility/i)).toBeVisible();
    await expect(page.getByText(/how to test it/i)).toBeVisible();
    await expect(page.getByText(/^Step 01$/)).toBeVisible();

    await page.getByRole("link", { name: /how to tie it/i }).click();
    await expect(page).toHaveURL(/\/tie\/palomar/);
    await expect(page.getByRole("link", { name: /all diagrams/i })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("boating discipline lists rope work and hides fishing terminals", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/library");
    await page.getByRole("radio", { name: /boating/i }).click();
    await expect(page.locator("article").filter({ hasText: "Bowline" }).first()).toBeVisible();
    await expect(page.locator("article").filter({ hasText: "Cleat Hitch" }).first()).toBeVisible();
    await expect(page.locator("article").filter({ hasText: "Palomar Knot" })).toHaveCount(0);
    await expect(page.getByText(/rope work/i).first()).toBeVisible();
    expect(errors).toEqual([]);
  });
});
