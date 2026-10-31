import { test } from '../../src/fixtures';
import { credentials } from '../../src/utils/env';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('standard user can log in and reach the product list @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(credentials.standardUser, credentials.password);
    await inventoryPage.expectLoaded();
  });

  // Data-driven negative cases: one test, many inputs
  const invalidLogins = [
    {
      name: 'locked-out user',
      user: credentials.lockedOutUser,
      pass: credentials.password,
      error: /locked out/i,
    },
    {
      name: 'wrong password',
      user: credentials.standardUser,
      pass: 'not-the-password',
      error: /do not match any user/i,
    },
    {
      name: 'missing username',
      user: '',
      pass: credentials.password,
      error: /Username is required/i,
    },
    {
      name: 'missing password',
      user: credentials.standardUser,
      pass: '',
      error: /Password is required/i,
    },
  ];

  for (const { name, user, pass, error } of invalidLogins) {
    test(`rejects login: ${name}`, async ({ loginPage }) => {
      await loginPage.login(user, pass);
      await loginPage.expectError(error);
    });
  }
});
