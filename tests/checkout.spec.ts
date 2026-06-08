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

test.describe('Checkout - Test cases', () => {
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

  test('TC EXTRA 01 - User can place and order with 1 item', async ({ page }) => {
    await globalPage.navigateToRegisterLogin();
    await registerLoginPage.login(users[0].email, users[0].password);
    await globalPage.navigateToProducts();
    await productsPage.searchForProduct(expectedProducts[0].name);
    await productsPage.searchButton.click();
    await productsPage.addFirstProductToCart();
    await productsPage.navigateToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.placeOrder();
    await paymentPage.fillPaymentDetails(users[0].name, users[0].cardNumber, users[0].cvc, users[0].expiryMonth, users[0].expiryYear);
    await paymentPage.submitPayment();
    await expect(page.getByText('Congratulations! Your order has been confirmed!', { exact: true })).toBeVisible();
    });
})  ;


