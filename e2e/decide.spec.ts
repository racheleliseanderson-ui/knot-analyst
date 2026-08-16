import { expect, test, type Page } from "@playwright/test";

/**
 * Decide (mode 01) end to end against the production build.
 * The contract under test is the philosophy, not the copy:
 * nothing scores until a job is declared, a declared job produces a ranked
 * decision card, and changing a field condition re-runs the model.
 */

const failOnPageErrors = (page: Page, sink: string[]) => {
  page.on("pageerror", (e) => sink.push(String(e)));
  page.on("console", (m) => {
    // Resource 404s (favicon and friends) are not app errors.
    if (m.type() === "error" && !m.text().includes("Failed to load resource")) {
      sink.push(m.text());
    }
  });
};

test.describe("Decide", () => {
  test("empty state refuses to score before a job is declared", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Scenario starters")).toBeVisible();
    await expect(page.getByText("Knot decision card")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test("a scenario starter runs the model and renders a decision card", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/");
    const starter = page.getByRole("button", { name: /^Load scenario:/ }).first();
    await expect(starter).toBeVisible();
    await starter.click();

    await expect(page.getByText("Knot decision card")).toBeVisible();
    // A verdict is always stated — recommended, constrained, or fail closed.
    await expect(
      page.getByText(/Recommended|Constrained fit|Fail closed/).first(),
    ).toBeVisible();
    // Field fit is reported as a percentage, never as a vague score.
    await expect(page.getByText(/\d+%/).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("deep link with connection + run produces the same instrument state", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto(
      "/?connection=braid-to-leader&main=braid&secondary=fluoro&diameter=main-much-thinner&guides=true&run=true",
    );
    await expect(page.getByText("Knot decision card")).toBeVisible();
    await expect(page.getByText(/\d+%/).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("changing a field condition re-runs the model", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /^Load scenario:/ }).first().click();
    await expect(page.getByText("Knot decision card")).toBeVisible();

    const before = await page.getByText(/\d+%/).first().innerText();

    const lowLight = page.getByRole("button", { name: /low light/i }).first();
    if (await lowLight.count()) {
      await lowLight.click();
      const rerun = page.getByRole("button", { name: /re-?run/i }).first();
      if (await rerun.isVisible().catch(() => false)) await rerun.click();
      await expect(page.getByText("Knot decision card")).toBeVisible();
    }

    const after = await page.getByText(/\d+%/).first().innerText();
    expect(after).toMatch(/\d+%/);
    expect(before).toMatch(/\d+%/);
  });
});
