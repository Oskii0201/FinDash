import { test, expect } from "@playwright/test";

test.describe("Currency Dashboard E2E Tests", () => {
  test("should fetch and display currencies in the table", async ({ page }) => {
    const mockResponse = {
      data: [
        { id: 1, currency: "USD", rate: 3.75, date: "2025-01-09" },
        { id: 2, currency: "EUR", rate: 4.2, date: "2025-01-15" },
      ],
      total: 2,
      page: 1,
      limit: 10,
    };

    await page.route("**/api/currencies**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockResponse),
      });
    });

    await page.goto("localhost:3000/login");

    await page.getByPlaceholder("Email").fill("test@example.com");
    await page.getByPlaceholder("Hasło").fill("Test123!");

    await page.click('button[type="submit"]');

    await expect(
      page.locator('input[placeholder="Select start date"]'),
    ).toBeVisible();
    await expect(
      page.locator('input[placeholder="Select end date"]'),
    ).toBeVisible();
    await expect(page.getByText("Fetch Currencies")).toBeVisible();

    await page.fill('input[placeholder="Select start date"]', "2025-01-01");
    await page.fill('input[placeholder="Select end date"]', "2025-01-31");

    const group2025Rows = page.locator('div[role="row"][id^="row-"]');
    await expect(
      group2025Rows.first().locator('div[role="cell"]').nth(0),
    ).toHaveText("2025-01-09");

    await expect(group2025Rows).toHaveCount(mockResponse.data.length);
  });
});
