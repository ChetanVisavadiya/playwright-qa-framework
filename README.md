# Playwright QA Framework (TypeScript)

A compact, CI-ready test automation framework covering **UI** (Page Object Model) and **API** (typed client with contract validation), built with Playwright and TypeScript.

> All tests run against public practice sites. No client code, data or credentials are used.

## What this demonstrates

- **UI automation** with the Page Object Model and custom Playwright fixtures
- **API automation** with a typed client and schema (contract) validation using [zod](https://zod.dev)
- **Data-driven tests**, plus `@smoke` and `@regression` tags for selective runs
- **Cross-browser** runs (Chromium, Firefox), parallel execution and retries on CI
- **Debuggability**: traces, screenshots and video captured on failure
- **CI/CD**: GitHub Actions workflow and a Jenkinsfile, with HTML and JUnit reports

## Test targets

| Layer | Target | Why |
|---|---|---|
| UI | [Sauce Demo](https://www.saucedemo.com) | Public e-commerce demo built for automation practice |
| API | [JSONPlaceholder](https://jsonplaceholder.typicode.com) | Free fake REST API (writes are accepted but not persisted) |

## Project structure

```
.
├── .github/workflows/playwright.yml   # GitHub Actions: API job + UI job
├── Jenkinsfile                        # Declarative Jenkins pipeline
├── playwright.config.ts               # Projects: api, chromium, firefox
├── src/
│   ├── api/
│   │   ├── ApiClient.ts               # Typed wrapper around APIRequestContext
│   │   └── schemas.ts                 # zod contracts for API responses
│   ├── pages/                         # Page objects (Login, Inventory, Cart, Checkout)
│   ├── fixtures/index.ts              # Custom `test` with injected page objects + api client
│   └── utils/                         # env/credentials, schema validation helper
└── tests/
    ├── api/posts.spec.ts              # CRUD, filtering, contract and negative-path tests
    └── ui/                            # Login (data-driven) and shopping/checkout flows
```

## Getting started

Requires Node.js 20 or newer.

```bash
npm ci
npx playwright install --with-deps chromium firefox   # one-time browser download
cp .env.example .env                                   # optional: override URLs / credentials
npm test
npm run report                                         # open the HTML report
```

## Running tests

| Command | What it runs |
|---|---|
| `npm test` | Everything (API + UI on Chromium and Firefox) |
| `npm run test:api` | API tests only (no browser needed) |
| `npm run test:ui` | UI tests on Chromium and Firefox |
| `npm run test:smoke` | Only tests tagged `@smoke` |
| `npm run test:headed` | UI tests in a visible Chromium window |
| `npm run typecheck` | TypeScript type check |

Run a single test by title: `npx playwright test -g "checkout"`

## Design decisions

- **Page Object Model**: selectors and page actions live in `src/pages`, so specs read like user intent and a UI change is fixed in one place.
- **Fixtures instead of `beforeEach` boilerplate**: `loggedInInventory` gives a test a logged-in user in one line, and each spec asks only for what it needs.
- **`ApiClient` returns the raw response**: tests assert status codes, headers and bodies explicitly, including negative cases, instead of hiding them inside helpers.
- **Contract checks with zod**: one schema validates the whole response shape and reports every violation at once, which catches API drift early.
- **`data-test` attributes**: `testIdAttribute` is set to `data-test` in the config so `getByTestId` works with this site's locator convention.
- **CI behaviour**: `forbidOnly` blocks committed `test.only`, retries are enabled only on CI, and traces are captured on the first retry.

## Extending

- **New page**: add a class in `src/pages` extending `BasePage`, register it in `src/fixtures/index.ts`, then request it by name in a spec.
- **New API endpoint**: add a method to `ApiClient`, a schema in `schemas.ts`, then write the spec using `parseWith(schema, await response.json())`.

## CI

- **GitHub Actions**: `.github/workflows/playwright.yml` runs the API and UI jobs in parallel and uploads reports as artifacts.
- **Jenkins**: `Jenkinsfile` runs install, typecheck, API and UI stages, then publishes JUnit results and archives reports.

## Author

Chetan Visavadiya, Senior QA Automation Engineer / SDET.
[LinkedIn](https://www.linkedin.com/in/chetanqaengineer)
