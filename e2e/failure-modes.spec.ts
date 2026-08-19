import { expect, test, type Page } from "@playwright/test";

/**
 * Family-level failure modes on Diagram / Tie / Applications.
 * Diagnose still starts from the symptom even when a knot is named.
 * HTH plates are the attached 0.3.19 package — not invented drawings.
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
    await expect(page.getByText(/HTH · Correct vs wrong/i).first()).toBeVisible();
    await expect(page.getByRole("img", { name: /finished-state check/i })).toBeVisible();
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

  test("Palomar shows the attached HTH four-mode plate", async ({ page }) => {
    await page.goto("/diagram/palomar");
    await expect(page.getByText(/HTH · Advanced failure modes/i).first()).toBeVisible();
    await expect(page.getByRole("img", { name: /what fails and what to do/i })).toBeVisible();
  });

  test("Bowline names the family and collar-capsize mode", async ({ page }) => {
    await page.goto("/diagram/bowline");
    await expect(page.getByText("Bowline family").first()).toBeVisible();
    await expect(page.getByText(/Open collar/i).first()).toBeVisible();
    await expect(page.getByText(/Yosemite Bowline|Water Bowline/i).first()).toBeVisible();
  });

  test("Cow hitch is a dropped-bight, not a jam hitch", async ({ page }) => {
    await page.goto("/diagram/cow-hitch");
    await expect(page.getByText("Dropped-bight family").first()).toBeVisible();
    await expect(page.getByText(/Only one leg loaded/i).first()).toBeVisible();
    await expect(page.getByText("Jam-to-hardware family")).toHaveCount(0);
  });

  test("Double sheet bend schematic is not a single-turn sheet bend", async ({ page }) => {
    await page.goto("/diagram/double-sheet-bend");
    await expect(page.getByText(/two turns around the bight/i).first()).toBeVisible();
    await page.goto("/diagram/sheet-bend");
    await expect(page.getByText(/second rope through, around, tucked/i).first()).toBeVisible();
  });

  test("Figure-8 stopper sits with the stopper family, not the loop", async ({ page }) => {
    await page.goto("/diagram/figure-8-stopper");
    await expect(page.getByText("Stopper family").first()).toBeVisible();
    await expect(page.getByText("Figure-eight loop family")).toHaveCount(0);
  });
});
