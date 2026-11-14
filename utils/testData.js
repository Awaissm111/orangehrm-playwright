// Central place for test data. The credentials below are the public demo
// credentials shown on the OrangeHRM login page; override with env vars if needed.

const users = {
  admin: {
    username: process.env.ORANGE_USER || 'Admin',
    password: process.env.ORANGE_PASS || 'admin123',
  },
  invalid: {
    username: 'WrongUser',
    password: 'wrongPass123',
  },
};

const routes = {
  login: '/web/index.php/auth/login',
  dashboard: '/web/index.php/dashboard/index',
  employeeList: '/web/index.php/pim/viewEmployeeList',
  addEmployee: '/web/index.php/pim/addEmployee',
};

/** Builds a unique employee so tests never collide on the shared demo site. */
function newEmployee() {
  const stamp = Date.now().toString().slice(-7);
  return {
    firstName: 'Auto',
    lastName: `Tester${stamp}`,
    employeeId: `9${stamp}`, // max 10 characters allowed by the app
  };
}

module.exports = { users, routes, newEmployee };
