const { routes } = require('../utils/testData');

class PimPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // Employee list
    this.addButton = page.getByRole('button', { name: 'Add' });
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.employeeIdFilter = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .locator('input');
    this.tableRows = page.locator('.oxd-table-card');
    this.noRecordsText = page.getByText('No Records Found').first();

    // Add employee form
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.employeeIdInput = page
      .locator('.oxd-input-group')
      .filter({ hasText: 'Employee Id' })
      .locator('input');
    this.saveButton = page.getByRole('button', { name: 'Save' }).first();
    this.fieldErrors = page.locator('.oxd-input-field-error-message');

    // Shared
    this.toast = page.locator('.oxd-toast');
    this.personalDetailsHeading = page.getByRole('heading', { name: 'Personal Details' });
  }

  async gotoEmployeeList() {
    await this.page.goto(routes.employeeList);
    await this.addButton.waitFor({ state: 'visible' });
  }

  async gotoAddEmployee() {
    await this.page.goto(routes.addEmployee);
    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  async addEmployee({ firstName, lastName, employeeId }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.employeeIdInput.fill(employeeId);
    await this.saveButton.click();
  }

  async searchByEmployeeId(employeeId) {
    await this.employeeIdFilter.fill(employeeId);
    await this.searchButton.click();
  }
}

module.exports = { PimPage };
