// Custom fixtures: every test can ask for a ready-made page object
// (loginPage, dashboardPage, pimPage) instead of creating it by hand.

const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { PimPage } = require('../pages/PimPage');

const test = base.test.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  pimPage: async ({ page }, use) => {
    await use(new PimPage(page));
  },
});

module.exports = { test, expect: base.expect };
