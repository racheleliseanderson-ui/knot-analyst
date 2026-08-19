import { expect, test } from "@playwright/test";

/**
 * Diagnose (mode 02) end to end: symptom-first, evidence reported, and the
 * handoff into Decide must carry the failure context.
 */

test.describe("Diagnose", () => {
  test("is symptom-first and locks later steps until a symptom is chosen", async ({ page }) => {
    await page.goto("/diagnose");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Symptom")).toBeVisible();
    await expect(page.getByText("Diagnosis card")).toHaveCount(0);

    const run = page.getByRole("button", { name: /run diagnosis/i });
    await expect(run).toBeDisabled();
  });

  test("a failure starter produces a diagnosis card with evidence", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto("/diagnose");
    await page
      .getByRole("button", { name: /let go at the join/i })
      .first()
      .click();

    await expect(page.getByText("Diagnosis card")).toBeVisible();
    await expect(page.getByText(/Evidence trail|What the failure rules out/).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("manual symptom selection runs the diagnosis", async ({ page }) => {
    await page.goto("/diagnose");
    await page
      .getByRole("button", { name: /broke under load/i })
      .first()
      .click();

    const run = page.getByRole("button", { name: /run diagnosis/i });
    await expect(run).toBeEnabled();
    await run.click();
    await expect(page.getByText("Diagnosis card")).toBeVisible();
  });

  test("a forensic starter treats the recovered end as evidence", async ({ page }) => {
    await page.goto("/diagnose");
    await page
      .getByRole("button", { name: /empty hook, curly pigtail/i })
      .first()
      .click();

    await expect(page.getByText("Diagnosis card")).toBeVisible();
    await expect(page.getByText(/recovered end is evidence|pigtail|curly/i).first()).toBeVisible();
    await expect(page.getByText(/retie now|cut it off/i).first()).toBeVisible();
  });

  test("boating discipline shows rope symptoms and a riding-turn starter", async ({ page }) => {
    await page.goto("/diagnose");
    await page.getByRole("radio", { name: /boating/i }).click();
    await expect(
      page.getByRole("button", { name: /riding turn|sheet jammed/i }).first(),
    ).toBeVisible();
    await page.getByRole("button", { name: /sheet jammed as a riding turn/i }).click();
    await expect(page.getByText("Diagnosis card")).toBeVisible();
    await expect(page.getByText(/handling|not a.*family|winch/i).first()).toBeVisible();
  });

  test("handoff carries the failure into Decide", async ({ page }) => {
    await page.goto("/diagnose");
    await page
      .getByRole("button", { name: /let go at the join/i })
      .first()
      .click();
    await expect(page.getByText("Diagnosis card")).toBeVisible();

    await page.getByRole("button", { name: /decide the replacement/i }).click();

    await expect(page).toHaveURL(/\/\?.*connection=/);
    await expect(page.getByText("Knot decision card")).toBeVisible();
  });
});
