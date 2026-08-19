import { expect, test, type Page } from "@playwright/test";

/**
 * Family-level failure modes on Diagram / Tie / Applications.
 * Diagnose still starts from the symptom even when a knot is named.
 */

const failOnPageErrors = (page: Page, sink: string[]) => {
  page.on("pageerror", (e) => sink.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !m.text().includes("Failed to load resource")) {
      sink.push(m.text());
    }
  });
};

test.describe("Failure modes", () => {
  test("Diagram names the distinctive hitch defect, not boilerplate", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/diagram/davy");
    await expect(page.getByText("Failure modes").first()).toBeVisible();
    await expect(page.getByText(/Wrong hitch path/i).first()).toBeVisible();
    await expect(page.getByText("Under-seated")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /this failed — start diagnose/i })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("Tie and Applications carry the same family plate", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/tie/davy");
    await expect(page.getByText("Failure modes").first()).toBeVisible();
    await expect(page.getByText(/Wrong hitch path/i).first()).toBeVisible();

    await page.goto("/applications/davy");
    await expect(page.getByText("Failure modes").first()).toBeVisible();
    await expect(page.getByText(/Wrong hitch path/i).first()).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("Diagnose with a named knot still requires a symptom", async ({ page }) => {
    const errors: string[] = [];
    failOnPageErrors(page, errors);

    await page.goto("/diagnose?knot=davy");
    await expect(page.getByText(/Named Davy Knot/i)).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/not from a knot name/i);
    await expect(page.getByRole("button", { name: /run diagnosis/i })).toBeDisabled();
    await expect(page.getByText("Diagnosis card")).toHaveCount(0);

    await page
      .getByRole("button", { name: /broke under load/i })
      .first()
      .click();
    await expect(page.getByLabel("Knot you tied")).toHaveValue("davy");
    await page.getByRole("button", { name: /run diagnosis/i }).click();
    await expect(page.getByText("Diagnosis card")).toBeVisible();
    await expect(page.getByText(/modelled failure modes/i).first()).toBeVisible();
    expect(errors).toEqual([]);
  });
});
