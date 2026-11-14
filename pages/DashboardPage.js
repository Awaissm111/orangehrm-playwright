const { routes } = require('../utils/testData');

class DashboardPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.oxd-topbar-header-breadcrumb-module');
    this.widgets = page.locator('.orangehrm-dashboard-widget');
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutItem = page.getByRole('menuitem', { name: 'Logout' });

    // Left side menu
    this.menuItems = page.locator('.oxd-main-menu-item');
    this.menuSearch = page.locator('.oxd-main-menu-search input');
  }

  async goto() {
    await this.page.goto(routes.dashboard);
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  widget(name) {
    return this.widgets.filter({ hasText: name });
  }

  menuItem(name) {
    return this.menuItems.filter({ hasText: name });
  }

  async openMenu(name) {
    await this.menuItem(name).click();
  }

  async searchMenu(text) {
    await this.menuSearch.fill(text);
  }

  async logout() {
    await this.userDropdown.click();
    await this.logoutItem.click();
  }
}

module.exports = { DashboardPage };
