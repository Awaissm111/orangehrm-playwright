// Runs once before the browser projects: logs in as Admin and saves the
// session to .auth/admin.json so the other tests start already signed in.

const { test: setup, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { users } = require('../utils/testData');

const AUTH_FILE = '.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(users.admin.username, users.admin.password);
  await expect(page).toHaveURL(/dashboard/);
  await page.context().storageState({ path: AUTH_FILE });
});
