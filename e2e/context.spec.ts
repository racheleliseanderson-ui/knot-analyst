import { expect, test, type Page } from "@playwright/test";

/**
 * Deep-linked job → Decide → Diagnose → back into Decide. The declared job is
 * state, not decoration: it must survive the URL, the mode switch, and the
 * handoff, and the carried constraints must stay attributed to the evidence.
 */

const DEEP_LINK =
  "/?connection=braid-to-leader&main=braid&secondary=fluoro" +
  "&diameter=main-much-thinner&guides=true&cold=true&run=true";

/** Every chip the instrument currently reports as declared. */
async function declared(page: Page) {
  return page.locator('button[aria-pressed="true"]').allInnerTexts();
}

test.describe("Deep-linked job context", () => {
  // The desktop column exposes the whole declared job at once; phones page it
  // through the guided stepper.
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop instrument column only");
    void page;
  });

  test("a deep-linked job is restored, declared, and scored", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto(DEEP_LINK);
    await expect(page.getByText("Knot decision card")).toBeVisible();

    const chips = (await declared(page)).join(" | ");
    expect(chips).toMatch(/braid/i);
    expect(chips).toMatch(/fluoro/i);
    expect(chips).toMatch(/must pass guides/i);
    expect(chips).toMatch(/cold/i);
    // Nothing the URL did not declare may arrive pre-set.
    expect(chips).not.toMatch(/low light/i);
    expect(chips).not.toMatch(/^wind$/im);

    expect(errors).toEqual([]);
  });

  test("context survives Decide → Diagnose → Decide with the failure attached", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto(DEEP_LINK);
    await expect(page.getByText("Knot decision card")).toBeVisible();
    const before = await page.getByText(/\d+%/).first().innerText();

    // Switch modes through the shell, the way a user would.
    await page
      .getByRole("link", { name: /diagnose/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/diagnose/);

    // Same job, now stated as a failure.
    await page
      .getByRole("button", { name: /let go at the join/i })
      .first()
      .click();
    await expect(page.getByText("Diagnosis card")).toBeVisible();

    await page.getByRole("button", { name: /decide the replacement/i }).click();

    // Back in Decide with the diagnosis attached, not silently merged.
    await expect(page).toHaveURL(/connection=braid-to-leader/);
    await expect(page).toHaveURL(/main=braid/);
    await expect(page).toHaveURL(/secondary=fluoro/);
    await expect(page.getByText("Carried from diagnosis")).toBeVisible();
    // The banner names the failure it came from, so the preload is attributable.
    await expect(page).toHaveURL(/from=/);

    // The job itself is restored in the instrument, and the model has run.
    const chips = (await declared(page)).join(" | ");
    expect(chips).toMatch(/braid/i);
    expect(chips).toMatch(/fluoro/i);
    await expect(page.getByText("Knot decision card")).toBeVisible();
    const after = await page.getByText(/\d+%/).first().innerText();
    expect(after).toMatch(/\d+%/);
    expect(before).toMatch(/\d+%/);

    // A reload must reproduce the same carried state from the URL alone.
    await page.reload();
    await expect(page.getByText("Carried from diagnosis")).toBeVisible();
    await expect(page.getByText("Knot decision card")).toBeVisible();

    expect(errors).toEqual([]);
  });
});

/**
 * Same contract on a phone. The guided stepper pages the declared job across
 * screens, so the job is read off the rail rather than one column — but the
 * URL is still the only authority, and the handoff must survive it.
 */
test.describe("Deep-linked job context (phone)", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "phone guided stepper only");
    void page;
  });

  /** Walk every step of the rail and collect the chips declared on each. */
  async function declaredAcrossSteps(page: Page) {
    const tabs = page.getByRole("tab");
    const count = await tabs.count();
    const all: string[] = [];
    for (let i = 0; i < count; i++) {
      await tabs.nth(i).click();
      all.push(...(await declared(page)));
    }
    return all.join(" | ");
  }

  test("a deep-linked job is restored and scored on a phone", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto(DEEP_LINK);
    await expect(page.getByText("Knot decision card")).toBeVisible();
    await expect(page.getByText(/\d+%/).first()).toBeVisible();

    const chips = await declaredAcrossSteps(page);
    expect(chips).toMatch(/braid/i);
    expect(chips).toMatch(/fluoro/i);
    expect(chips).toMatch(/must pass guides/i);
    expect(chips).toMatch(/cold/i);
    // Nothing undeclared may arrive pre-set on the small layout either.
    expect(chips).not.toMatch(/low light/i);

    expect(errors).toEqual([]);
  });

  test("context survives Decide → Diagnose → Decide on a phone", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto(DEEP_LINK);
    await expect(page.getByText("Knot decision card")).toBeVisible();

    await page
      .getByRole("link", { name: /diagnose/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/diagnose/);

    await page
      .getByRole("button", { name: /let go at the join/i })
      .first()
      .click();
    await expect(page.getByText("Diagnosis card")).toBeVisible();

    await page.getByRole("button", { name: /decide the replacement/i }).click();

    await expect(page).toHaveURL(/connection=braid-to-leader/);
    await expect(page).toHaveURL(/main=braid/);
    await expect(page).toHaveURL(/secondary=fluoro/);
    await expect(page).toHaveURL(/from=/);
    await expect(page.getByText("Carried from diagnosis")).toBeVisible();
    await expect(page.getByText("Knot decision card")).toBeVisible();

    // The URL alone must reproduce the carried state after a reload.
    await page.reload();
    await expect(page.getByText("Carried from diagnosis")).toBeVisible();
    await expect(page.getByText("Knot decision card")).toBeVisible();

    expect(errors).toEqual([]);
  });
});
