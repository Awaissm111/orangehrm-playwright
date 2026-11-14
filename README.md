# OrangeHRM Playwright Framework (JavaScript)

End-to-end tests for the public OrangeHRM demo site
(https://opensource-demo.orangehrmlive.com) using Playwright Test and the
Page Object Model.

## Setup

Requires Node.js 18 or newer.

```bash
npm install
npx playwright install
```

In VS Code, install the "Playwright Test for VSCode" extension (by Microsoft)
to run and debug tests from the Testing sidebar.

## Running tests

| Command | What it does |
| --- | --- |
| `npm test` | Run everything headless (Chromium + Firefox) |
| `npx playwright test --project=chromium` | Chromium only |
| `npm run test:headed` | Watch the browser while tests run |
| `npm run test:ui` | Playwright UI mode (best for learning) |
| `npm run test:debug` | Step through with the inspector |
| `npm run test:smoke` | Only tests tagged `@smoke` |
| `npm run report` | Open the HTML report of the last run |
| `npm run codegen` | Record actions and generate locators |

## Structure

```
playwright.config.js   Base URL, timeouts, browsers, reporters
fixtures/baseTest.js   Custom fixtures that inject page objects into tests
pages/                 Page objects (locators + actions, no assertions)
  LoginPage.js
  DashboardPage.js
  PimPage.js
tests/
  auth.setup.js        Logs in once and saves the session to .auth/
  login.spec.js        Login: valid, invalid, required fields, forgot password, logout
  dashboard.spec.js    Widgets, side menu navigation (data-driven), menu search
  pim.spec.js          Add employee, search by ID, validation
  basic.spec.js        10 basic checks (TC01-TC10) across login, Admin, PIM, Leave, Directory
utils/testData.js      Credentials, routes, unique test-data builder
```

## How it works

- **Saved login**: `auth.setup.js` signs in once; other tests reuse that
  session through `storageState`, so they do not repeat the login steps.
  `login.spec.js` clears the session to test the login form itself.
- **Fixtures**: tests receive `loginPage`, `dashboardPage`, `pimPage` as
  arguments instead of calling `new LoginPage(page)` each time.
- **Assertions live in tests**, page objects only expose locators and actions.
- **On failure** you get a screenshot, video and a trace
  (`npx playwright show-trace <trace.zip>`).

## Notes

- The demo site is shared and resets periodically. It can be slow, so the
  config uses generous timeouts and one retry.
- Credentials are the public demo ones (Admin / admin123). Override with
  `ORANGE_USER`, `ORANGE_PASS` and `BASE_URL` environment variables.
