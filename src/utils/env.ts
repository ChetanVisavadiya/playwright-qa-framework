/**
 * Test credentials for the public Sauce Demo site.
 * These values are published on the site's own login page; override via .env if needed.
 */
export const credentials = {
  standardUser: process.env.SAUCE_USERNAME ?? 'standard_user',
  lockedOutUser: 'locked_out_user',
  password: process.env.SAUCE_PASSWORD ?? 'secret_sauce',
};
