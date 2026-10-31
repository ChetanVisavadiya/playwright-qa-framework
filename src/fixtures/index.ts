import { test as base, expect } from '@playwright/test';
import { ApiClient } from '../api/ApiClient';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { credentials } from '../utils/env';

type Fixtures = {
  api: ApiClient;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  /** An inventory page for a user who is already logged in as the standard user. */
  loggedInInventory: InventoryPage;
};

/**
 * Custom `test` with page objects and an API client injected as fixtures.
 * Specs request only what they need; setup/teardown stays out of the test body.
 */
export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  loggedInInventory: async ({ page, loginPage, inventoryPage }, use) => {
    await loginPage.open();
    await loginPage.login(credentials.standardUser, credentials.password);
    await inventoryPage.expectLoaded();
    await use(inventoryPage);
  },
});

export { expect };
