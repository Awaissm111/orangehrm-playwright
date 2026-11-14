const { test, expect } = require('../fixtures/baseTest');

test.describe('Dashboard and navigation', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goto();
  });

  test('dashboard shows its widgets @smoke', async ({ dashboardPage }) => {
    await expect(dashboardPage.pageTitle).toHaveText('Dashboard');
    await expect(dashboardPage.widget('Time at Work')).toBeVisible();
    await expect(dashboardPage.widget('Quick Launch')).toBeVisible();
  });

  // Data-driven: one test per menu entry.
  const menus = [
    { name: 'Admin', url: /admin\/viewSystemUsers/ },
    { name: 'PIM', url: /pim\/viewEmployeeList/ },
    { name: 'Leave', url: /leave\/viewLeaveList/ },
    { name: 'Recruitment', url: /recruitment\/viewCandidates/ },
    { name: 'My Info', url: /pim\/viewPersonalDetails/ },
  ];

  for (const menu of menus) {
    test(`side menu opens ${menu.name}`, async ({ dashboardPage, page }) => {
      await dashboardPage.openMenu(menu.name);

      await expect(page).toHaveURL(menu.url);
    });
  }

  test('menu search filters the side menu', async ({ dashboardPage }) => {
    await dashboardPage.searchMenu('PIM');

    await expect(dashboardPage.menuItems).toHaveCount(1);
    await expect(dashboardPage.menuItems.first()).toHaveText('PIM');
  });
});
