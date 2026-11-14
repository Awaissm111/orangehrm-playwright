const { test, expect } = require('../fixtures/baseTest');
const { newEmployee } = require('../utils/testData');

test.describe('PIM - employees', () => {
  test('add a new employee and find it by ID @smoke', async ({ pimPage, page }) => {
    const employee = newEmployee();

    await test.step('Add the employee', async () => {
      await pimPage.gotoAddEmployee();
      await pimPage.addEmployee(employee);

      await expect(pimPage.toast).toContainText('Success');
      await expect(page).toHaveURL(/viewPersonalDetails/);
      await expect(pimPage.personalDetailsHeading).toBeVisible();
    });

    await test.step('Search for the employee by ID', async () => {
      await pimPage.gotoEmployeeList();
      await pimPage.searchByEmployeeId(employee.employeeId);

      await expect(pimPage.tableRows).toHaveCount(1);
      await expect(pimPage.tableRows.first()).toContainText(employee.employeeId);
      await expect(pimPage.tableRows.first()).toContainText(employee.lastName);
    });
  });

  test('first and last name are required', async ({ pimPage }) => {
    await pimPage.gotoAddEmployee();
    await pimPage.saveButton.click();

    await expect(pimPage.fieldErrors).toHaveCount(2);
    await expect(pimPage.fieldErrors.first()).toHaveText('Required');
  });

  test('searching an unknown employee ID returns no records', async ({ pimPage }) => {
    await pimPage.gotoEmployeeList();
    await pimPage.searchByEmployeeId('0000000000');

    await expect(pimPage.tableRows).toHaveCount(0);
    await expect(pimPage.noRecordsText).toBeVisible();
  });
});
