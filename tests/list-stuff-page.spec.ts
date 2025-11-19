import { test, expect } from './auth-utils';

test.slow();
test('List Stuff Page', async ({ getUserPage }) => {
  // Call the getUserPage fixture with john signin info to get authenticated session
  const page = await getUserPage('john@foo.com', 'changeme');

  // Navigate to the list page
  await page.goto('http://localhost:3000/list');

  // Verify the page title/heading
  await expect(page.getByRole('heading', { name: 'Stuff' })).toBeVisible();

  // Verify navigation links are visible
  await expect(page.getByRole('link', { name: 'Add Stuff' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'List Stuff' })).toBeVisible();

  // Verify logged-in user is displayed
  await expect(page.getByRole('button', { name: 'john@foo.com' })).toBeVisible();

  // Verify the table is displayed with correct headers
  await expect(page.locator('th:has-text("Name")')).toBeVisible();
  await expect(page.locator('th:has-text("Quantity")')).toBeVisible();
  await expect(page.locator('th:has-text("Condition")')).toBeVisible();
  await expect(page.locator('th:has-text("Actions")')).toBeVisible();

  // Verify john's items are displayed in the table
  // John should see Basket and Bicycle
  await expect(page.locator('td:has-text("Basket")')).toBeVisible();
  await expect(page.locator('td:has-text("Bicycle")')).toBeVisible();

  // Verify quantities are displayed
  const quantities = page.locator('table tbody tr td:nth-child(2)');
  await expect(quantities.first()).toContainText('3');
  await expect(quantities.nth(1)).toContainText('2');

  // Verify conditions are displayed
  await expect(page.locator('td:has-text("excellent")')).toBeVisible();
  await expect(page.locator('td:has-text("poor")')).toBeVisible();

  // Verify Edit links are present for each item
  const editLinks = page.getByRole('link', { name: 'Edit' });
  await expect(editLinks).toHaveCount(2);
});
