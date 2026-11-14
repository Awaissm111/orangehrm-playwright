const { test, expect } = require('../fixtures/baseTest');
const { users } = require('../utils/testData');

// Login tests must start signed out, so they ignore the saved session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid credentials open the dashboard @smoke', async ({ loginPage, dashboardPage, page }) => {
    await loginPage.login(users.admin.username, users.admin.password);

    await expect(page).toHaveURL(/dashboard/);
    await expect(dashboardPage.pageTitle).toHaveText('Dashboard');
  });

  test('invalid credentials show an error', async ({ loginPage, page }) => {
    await loginPage.login(users.invalid.username, users.invalid.password);

    await expect(loginPage.errorAlert).toHaveText('Invalid credentials');
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('valid username with wrong password is rejected', async ({ loginPage }) => {
    await loginPage.login(users.admin.username, users.invalid.password);

    await expect(loginPage.errorAlert).toHaveText('Invalid credentials');
  });

  test('empty form shows Required on both fields', async ({ loginPage }) => {
    await loginPage.loginButton.click();

    await expect(loginPage.fieldErrors).toHaveCount(2);
    await expect(loginPage.fieldErrors.first()).toHaveText('Required');
  });

  test('empty password shows Required on one field', async ({ loginPage }) => {
    await loginPage.usernameInput.fill(users.admin.username);
    await loginPage.loginButton.click();

    await expect(loginPage.fieldErrors).toHaveCount(1);
  });

  test('password field masks its input', async ({ loginPage }) => {
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('forgot password link opens the reset page', async ({ loginPage, page }) => {
    await loginPage.forgotPasswordLink.click();

    await expect(page).toHaveURL(/requestPasswordResetCode/);
    await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
  });

  // Logout lives here (fresh login) so it never ends the saved session other tests share.
  test('logout returns to the login page @smoke', async ({ loginPage, dashboardPage, page }) => {
    await loginPage.login(users.admin.username, users.admin.password);
    await expect(page).toHaveURL(/dashboard/);

    await dashboardPage.logout();

    await expect(page).toHaveURL(/auth\/login/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});
