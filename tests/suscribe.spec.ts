/// Website choosen: automation exercise website: https://automationexercise.com/

import { test, expect } from '@playwright/test';
import expectedProducts from '../data/products.json';
import users from '../data/users.json';
import { GlobalPage } from '../pages/GlobalPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ContactPage } from '../pages/ContactPage';
import { RegisterLoginPage } from '../pages/RegisterLoginPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage'

test.describe('Suscribe - Test cases', () => {
  let globalPage: GlobalPage;
  let productsPage: ProductsPage;
  let contactPage: ContactPage;
  let registerLoginPage: RegisterLoginPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let paymentPage: PaymentPage;
  const randomNumber = Math.floor(Math.random() * 99999);
  const randomEmail = `${users[0].name}${randomNumber}@yopmail.com`;

  test.beforeEach(async ({ page }) => {
    globalPage = new GlobalPage(page);
    productsPage = new ProductsPage(page);
    contactPage = new ContactPage(page);
    registerLoginPage = new RegisterLoginPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    paymentPage = new PaymentPage(page)

    await page.route('**/*', (route) => {
    const url = route.request().url();

    if (url.includes('googleads') || url.includes('doubleclick') || url.includes('adservice')) {
      route.abort(); 
    } else {
      route.continue(); 
    }
  });
    await page.goto('/', { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
  });





  test('Suscribe - TC EXTRA 01 - User can suscribe to newsletter in homepage and verify success message', async ({ page }) => {
    await globalPage.suscribeToNewsletter(randomEmail);
    await expect(page.getByText('You have been successfully subscribed!')).toBeVisible({ timeout: 10000 });
  });

  test('Suscribe - TC EXTRA 02 - User cannot suscribe to newsletter with invalid email', async ({ page }) => {
    await globalPage.suscribeToNewsletter('invalid-email');
    await expect(page.getByText('You have been successfully subscribed!')).not.toBeVisible();
  });
})



