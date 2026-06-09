# Automation Exercise — Playwright E2E Test Suite

This repository contains an end-to-end test suite written with Playwright and TypeScript. The tests automate user journeys on the demo website (configured baseURL: https://automationexercise.com/) and cover product listing/search, product detail page (PDP), cart, checkout, registration/login, contact form and newsletter subscription flows.

## Contents in this repository
- `pages/` — Page Object classes used by tests (GlobalPage, ProductsPage, ProductDetailPage, CartPage, CheckoutPage, PaymentPage, ContactPage, RegisterLoginPage)
- `tests/` — Playwright test specs (pdp.spec.ts, plp.spec.ts, cart.spec.ts, checkout.spec.ts, login.spec.ts, register.spec.ts, suscribe.spec.ts)
- `data/` — Test fixture files: `products.json`, `users.json`, and `testFile.txt` (used for file upload test)
- `playwright.config.ts` — Playwright configuration (timeouts, projects, baseURL, reporter)
- `playwright-report/` — Generated HTML report output (created after running tests)

## Test cases

`- CART PAGE:`
* User can add multiple products to cart and verify price/quantity/total
* User can remove product from cart

`- CHECKOUT:`
* User can place and order with 1 item

`- LOGIN:`
* User can login and logout successfully

`- REGISTER:`
* User can register and login successfully
* User cannot register with existing email
* User cannot register with invalid email
* User cannot create an account with empty account/address information
* User is able to delete account

`- SUSCRIBE:`
* User can suscribe to newsletter in homepage and verify success message
* User cannot suscribe to newsletter with invalid email

`- PRODUCT LIST PAGE:`
* User can search for a product and see relevant results
* Promo big banner is visible

`- PRODUCT DETAIL PAGE:`
* User is able to write a review
* User can open product details and verify name, price, availability
* User is not able to submit a review with empty name and email

-`Test cases with title EXTRA are test cases not required by the course`-


## How to run
```bash
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

Key implementation notes
- Tests use Page Object classes in `pages/` to keep tests readable and maintainable.
- Tests block ad network requests during navigation (see test file beforeEach route handler) to reduce flakiness and speed up runs.
- Many tests generate a random email using `users.json` and a randomized suffix (yopmail) to avoid collisions.


- File upload test: uses `data/testFile.txt`. Ensure the file path is correct when running from a different working directory.

