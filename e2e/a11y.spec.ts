import { expect, test, type Page } from "@playwright/test";

/**
 * Accessibility smoke tests on the phone layout: the instrument must be
 * operable from the keyboard alone and every control must state what it is.
 * These are contracts, not style checks — a control without a name is a
 * control a screen-reader user cannot run.
 */

test.describe("Mobile accessibility smoke", () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "phone layout only");
    void page;
  });

  /** Accessible name of whatever currently holds focus. */
  async function focused(page: Page) {
    return page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return null;
      return {
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute("role"),
        name: (el.getAttribute("aria-label") ?? el.innerText ?? "").trim().slice(0, 80),
      };
    });
  }

  /** Tab until the predicate matches or we run out of patience. */
  async function tabTo(page: Page, match: RegExp, limit = 60) {
    for (let i = 0; i < limit; i++) {
      await page.keyboard.press("Tab");
      const f = await focused(page);
      if (f && match.test(f.name)) return f;
    }
    return null;
  }

  test("scenario starters are named and keyboard-operable", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto("/");

    const starters = page.getByRole("button", { name: /^Load scenario:/ });
    expect(await starters.count()).toBeGreaterThan(0);

    // Every starter states the scenario it loads, not just "load".
    for (const name of await starters.allTextContents()) {
      expect(name.trim().length).toBeGreaterThan(0);
    }
    const first = starters.first();
    await expect(first).toHaveAttribute("aria-label", /^Load scenario:/);

    // Reachable by Tab, and Enter runs it — no pointer required.
    const hit = await tabTo(page, /^Load scenario:/i);
    expect(hit, "a scenario starter must be reachable by Tab").not.toBeNull();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Knot decision card")).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("the guided stepper rail exposes tab semantics and keyboard activation", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto("/");
    await page.getByRole("button", { name: /^Load scenario:/ }).first().click();

    // The rail is a named tablist with exactly one selected step.
    const rail = page.getByRole("tablist", { name: /decision steps/i });
    await expect(rail).toBeVisible();
    const tabs = rail.getByRole("tab");
    const count = await tabs.count();
    expect(count).toBeGreaterThan(1);
    await expect(rail.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
    await expect(rail.locator('[role="tab"][aria-current="step"]')).toHaveCount(1);

    // A later step can be selected from the keyboard alone.
    const target = tabs.nth(1);
    await target.focus();
    await page.keyboard.press("Enter");
    await expect(target).toHaveAttribute("aria-selected", "true");
    await expect(rail.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);

    // Rail controls stay thumb-sized.
    for (let i = 0; i < count; i++) {
      const box = await tabs.nth(i).boundingBox();
      expect(box, "rail tabs must be rendered").not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(40);
    }

    expect(errors).toEqual([]);
  });

  test("the Diagnose → Decide handoff is named and keyboard-operable", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto("/diagnose");

    // Symptom controls state the symptom, so the list is usable unseen.
    const symptom = page.getByRole("button", { name: /let go at the join/i }).first();
    await expect(symptom).toBeVisible();
    await symptom.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Diagnosis card")).toBeVisible();

    // The handoff is a real, named control — reachable and runnable by keyboard.
    const handoff = page.getByRole("button", { name: /decide the replacement/i });
    await expect(handoff).toBeVisible();
    const box = await handoff.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(40);

    await handoff.focus();
    await expect(handoff).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL(/from=/);
    await expect(page.getByText("Carried from diagnosis")).toBeVisible();

    expect(errors).toEqual([]);
  });
});

/**
 * Printable card flow. The card is the artefact a user takes into the field,
 * so its controls must be ordered, visibly focusable, and self-describing on
 * both the phone and the desktop column.
 */
test.describe("Printable card accessibility", () => {
  /** Accessible-name list of the focus path, starting from a given control. */
  async function tabOrderFrom(page: Page, steps: number) {
    const seen: string[] = [];
    for (let i = 0; i < steps; i++) {
      await page.keyboard.press("Tab");
      const name = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el) return "";
        return (el.getAttribute("aria-label") ?? el.innerText ?? "").trim().slice(0, 60);
      });
      seen.push(name);
    }
    return seen;
  }

  /** Does the focused element render a focus indicator a sighted user can see? */
  async function hasVisibleFocusRing(page: Page) {
    return page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return false;
      const s = getComputedStyle(el);
      const outline =
        s.outlineStyle !== "none" && parseFloat(s.outlineWidth || "0") > 0;
      const ring = s.boxShadow !== "none" && s.boxShadow.trim().length > 0;
      return outline || ring;
    });
  }

  test("card controls are named, ordered, and visibly focusable", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));

    await page.goto("/");
    await page.getByRole("button", { name: /^Load scenario:/ }).first().click();
    await expect(page.getByText("Knot decision card")).toBeVisible();

    // Each export control states what it produces, not just "PDF".
    const brief = page.getByRole("button", { name: /^Brief PDF —/ });
    const field = page.getByRole("button", { name: /^Field packet PDF —/ });
    await expect(brief).toBeVisible();
    await expect(field).toBeVisible();

    const print = page.getByRole("button", { name: /^Print$/ });
    await expect(print).toBeVisible();
    // Compare is a link, so it must read as one to assistive tech.
    await expect(page.getByRole("link", { name: /^Compare$/ })).toBeVisible();

    // Focus order follows the visual order: Print → Compare → Brief → Field.
    await print.focus();
    await expect(print).toBeFocused();
    const order = await tabOrderFrom(page, 3);
    expect(order[0]).toMatch(/compare/i);
    expect(order[1]).toMatch(/^Brief PDF/);
    expect(order[2]).toMatch(/^Field packet PDF/);

    // Every one of them shows where focus is.
    for (const control of [print, brief, field]) {
      await control.focus();
      expect(
        await hasVisibleFocusRing(page),
        "card control must render a visible focus indicator",
      ).toBe(true);
    }

    expect(errors).toEqual([]);
  });

  test("print media keeps the card and drops its controls", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /^Load scenario:/ }).first().click();
    await expect(page.getByText("Knot decision card")).toBeVisible();

    await page.emulateMedia({ media: "print" });
    await expect(page.getByText("Knot decision card")).toBeVisible();
    // Interactive chrome is not part of the printed artefact.
    await expect(page.getByRole("button", { name: /^Print$/ })).toBeHidden();
    await expect(page.getByRole("button", { name: /^Brief PDF —/ })).toBeHidden();
    await page.emulateMedia({ media: "screen" });

    // Back on screen the controls return, still keyboard-reachable.
    const print = page.getByRole("button", { name: /^Print$/ });
    await print.focus();
    await expect(print).toBeFocused();
  });
});
