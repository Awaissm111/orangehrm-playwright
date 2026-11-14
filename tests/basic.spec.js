// 10 basic test cases covering the main OrangeHRM modules.
// Run only this file:  npx playwright test tests/basic.spec.js --project=chromium

const { test, expect } = require('../fixtures/baseTest');
const { routes } = require('../utils/testData');

const ADMIN_USERS_URL = '/web/index.php/admin/viewSystemUsers';

test.describe('Basic - login page', () => {
  // These two need a signed-out browser.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('TC01 - login page has the OrangeHRM title', async ({ loginPage, page }) => {
    await loginPage.goto();

    await expect(page).toHaveTitle('OrangeHRM');
  });

  test('TC02 - login page shows logo, heading and all fields', async ({ loginPage, page }) => {
    await loginPage.goto();

    await expect(page.getByAltText('company-branding')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
  });
});

test.describe('Basic - after login', () => {
  test('TC03 - user menu lists About, Support, Change Password, Logout', async ({ dashboardPage, page }) => {
    await dashboardPage.goto();
    await dashboardPage.userDropdown.click();

    for (const item of ['About', 'Support', 'Change Password', 'Logout']) {
      await expect(page.getByRole('menuitem', { name: item })).toBeVisible();
    }
  });

  test('TC04 - Admin page shows the System Users list', async ({ page }) => {
    await page.goto(ADMIN_USERS_URL);

    await expect(page.getByRole('heading', { name: 'System Users' })).toBeVisible();
    await expect(page.locator('.oxd-table-card').first()).toBeVisible();
  });

  test('TC05 - Admin: searching username "Admin" finds the user', async ({ page }) => {
    await page.goto(ADMIN_USERS_URL);
    const usernameFilter = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Username' })
      .locator('input');

    await usernameFilter.fill('Admin');
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.locator('.oxd-table-card')).toHaveCount(1);
    await expect(page.locator('.oxd-table-card').first()).toContainText('Admin');
  });

  test('TC06 - Admin: Reset clears the username filter', async ({ page }) => {
    await page.goto(ADMIN_USERS_URL);
    const usernameFilter = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Username' })
      .locator('input');

    await usernameFilter.fill('SomeUser');
    await page.getByRole('button', { name: 'Reset' }).click();

    await expect(usernameFilter).toHaveValue('');
  });

  test('TC07 - PIM: employee table shows its columns', async ({ pimPage, page }) => {
    await pimPage.gotoEmployeeList();
    const header = page.locator('.oxd-table-header');

    await expect(header).toContainText('Id');
    await expect(header).toContainText('Last Name');
    await expect(header).toContainText('Job Title');
  });

  test('TC08 - PIM: Add button opens the Add Employee form', async ({ pimPage, page }) => {
    await pimPage.gotoEmployeeList();
    await pimPage.addButton.click();

    await expect(page).toHaveURL(new RegExp(routes.addEmployee));
    await expect(page.getByRole('heading', { name: 'Add Employee' })).toBeVisible();
    await expect(pimPage.firstNameInput).toBeVisible();
  });

  test('TC09 - Leave menu opens the Leave List page', async ({ dashboardPage, page }) => {
    await dashboardPage.goto();
    await dashboardPage.openMenu('Leave');

    await expect(dashboardPage.pageTitle).toHaveText('Leave');
    await expect(page.getByRole('heading', { name: 'Leave List' })).toBeVisible();
  });

  test('TC10 - Directory menu opens the Directory page', async ({ dashboardPage, page }) => {
    await dashboardPage.goto();
    await dashboardPage.openMenu('Directory');

    await expect(page).toHaveURL(/directory\/viewDirectory/);
    await expect(page.getByRole('heading', { name: 'Directory' })).toBeVisible();
  });
});
