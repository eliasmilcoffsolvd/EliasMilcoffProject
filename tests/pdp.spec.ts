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
import { ProductDetailPage } from '../pages/ProductDetailPage';

test.describe('PDP - Test cases' , () => {
  let globalPage: GlobalPage;
  let productsPage: ProductsPage;
  let contactPage: ContactPage;
  let registerLoginPage: RegisterLoginPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let paymentPage: PaymentPage;
  let productDetailPage: ProductDetailPage;
  const randomNumber = Math.floor(Math.random() * 99999);
  const randomEmail = `${users[0].name}${randomNumber}@yopmail.com`;

  test.beforeEach(async ({ page }) => {
    globalPage = new GlobalPage(page);
    productsPage = new ProductsPage(page);
    contactPage = new ContactPage(page);
    registerLoginPage = new RegisterLoginPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    paymentPage = new PaymentPage(page);
    productDetailPage = new ProductDetailPage(page);

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

  test('PDP - TC - 01 User can open product details and verify name, price, availability' , async ({ page }) => {
    await globalPage.navigateToProducts();
    await productsPage.openFirstProductPage();
    const productName = page.locator('.product-information h2');
    await expect(productName).not.toBeNull(); 
    await expect(productName).toBeVisible(); 
    await expect(page.getByText('Rs.')).toBeVisible(); 
    await expect(page.getByText('Availability:')).toBeVisible();
    await expect(page.getByText('Condition:')).toBeVisible();
    await expect(page.getByText('Brand:')).toBeVisible(); 
  });

  test('EXTRA - PDP TC-02 User is able to write a review', async ({page}) => {
    await globalPage.navigateToProducts();
    await productsPage.openFirstProductPage();
    expect(page.getByRole('link', { name: 'Write Your Review' })).toBeVisible();
    await productDetailPage.fillName(users[0].name);
    await productDetailPage.fillEmail(users[0].email);
    await productDetailPage.fillReview('Test message');
    await productDetailPage.submitReview()
    await expect(page.getByText('Thank you for your review.')).toBeVisible();
  })

  test('EXTRA - PDP TC-03 User is not able to submit a review with empty name and email', async ({ page }) => {
    await globalPage.navigateToProducts();
    await productsPage.openFirstProductPage();
    expect(page.getByRole('link', { name: 'Write Your Review' })).toBeVisible();
    await productDetailPage.submitReview()
    await expect(page.getByText('Thank you for your review.')).not.toBeVisible();
  })

});


