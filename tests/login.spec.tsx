import { test, expect } from "@playwright/test";

test.describe("Login Tests", () => {
  test("should log in successfully with valid credentials", async ({
    page,
  }) => {
    await page.goto("localhost:3000/login");

    await page.getByPlaceholder("Email").fill("test@example.com");
    await page.getByPlaceholder("Hasło").fill("Test123!");

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/);

    await expect(page.locator('[id="\\31 "]')).toMatchAriaSnapshot(`
    - alert:
      - img
      - text: Zalogowano pomyślnie!
      - button "close"
      - progressbar "notification timer"
    `);
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("localhost:3000/login");

    await page.getByPlaceholder("Email").fill("invalid@example.com");
    await page.getByPlaceholder("Hasło").fill("invalid");

    await page.click('button[type="submit"]');

    await expect(page.locator('[id="\\31 "]')).toMatchAriaSnapshot(`
    - alert:
      - img
      - text: Nieprawidłowy email lub hasło.
      - button "close"
      - progressbar "notification timer"
    `);
  });
});
