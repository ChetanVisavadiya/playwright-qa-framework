import { test, expect } from '../../src/fixtures';

const BACKPACK = 'Sauce Labs Backpack';
const BIKE_LIGHT = 'Sauce Labs Bike Light';

test.describe('Shopping', () => {
  test('adding a product updates the cart badge @smoke', async ({ loggedInInventory }) => {
    await loggedInInventory.addToCart(BACKPACK);
    await expect(loggedInInventory.cartBadge).toHaveText('1');
  });

  test('products can be sorted by price, low to high', async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy('lohi');

    const prices = await loggedInInventory.getPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('products can be sorted by name, Z to A', async ({ loggedInInventory }) => {
    await loggedInInventory.sortBy('za');

    const names = await loggedInInventory.getProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('cart shows the products that were added', async ({ loggedInInventory, cartPage }) => {
    await loggedInInventory.addToCart(BACKPACK);
    await loggedInInventory.addToCart(BIKE_LIGHT);
    await loggedInInventory.openCart();

    await cartPage.expectItemCount(2);
    await cartPage.expectContains(BACKPACK);
    await cartPage.expectContains(BIKE_LIGHT);
  });

  test('user can complete a checkout end to end @smoke @regression', async ({
    loggedInInventory,
    cartPage,
    checkoutPage,
  }) => {
    await loggedInInventory.addToCart(BACKPACK);
    await loggedInInventory.openCart();
    await cartPage.checkout();

    await checkoutPage.fillShipping({ firstName: 'Test', lastName: 'User', postalCode: '380001' });
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
  });
});
