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

test.describe('Cart Page - Test cases', () => {
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

  test('TC - 01 User can add multiple products to cart and verify price/quantity/total', async ({ page }) => {

  await globalPage.navigateToProducts();
  await productsPage.searchForProduct(expectedProducts[0].name);
  await page.getByRole('link', { name: 'View Product' }).click()
  await page.locator('#quantity').fill('3')
  await page.getByRole('button', { name: 'Add to cart' }).click()
  await page.getByRole('button', { name: 'Continue Shopping' }).click()
  await globalPage.navigateToProducts();
  await productsPage.searchForProduct(expectedProducts[1].name);
  await productsPage.addProductToCartByName(expectedProducts[1].name);
  await productsPage.navigateToCart();
  const productRows = page.locator('#cart_info_table tbody tr[id^="product-"]');
  await expect(productRows).toHaveCount(expectedProducts.length);  
// 4. Dynamic loop to audit calculations for each row
  for (const expectedProduct of expectedProducts) {
    const matchingRow = productRows.filter({ hasText: expectedProduct.name });
    await expect(matchingRow).toBeVisible();
    await expect(matchingRow.getByRole('link', { name: expectedProduct.name })).toBeVisible();

    // Extract text values from the current row in the Cart Page
    const priceText = await matchingRow.locator('.cart_price p').innerText();
    const quantityText = await matchingRow.locator('.cart_quantity button').innerText();
    const totalText = await matchingRow.locator('.cart_total_price').innerText();

    // Convert extracted text values to integers (stripping out "Rs.", symbols, and spaces)
    const actualPrice = parseInt(priceText.replace(/\D/g, ''), 10);
    const actualQuantity = parseInt(quantityText.replace(/\D/g, ''), 10);
    const actualTotal = parseInt(totalText.replace(/\D/g, ''), 10);
    
    // A. Validate that the unit price on the screen matches the JSON data
    expect(actualPrice).toBe(expectedProduct.price);

    // B. Validate specific quantities set during the purchase flow
    if (expectedProduct.name === expectedProducts[0].name) {
      expect(actualQuantity).toBe(3); // First product must display a quantity of 3
    } else {
      expect(actualQuantity).toBe(1); // Second product must display a quantity of 1
    }

    // C. Calculate the expected total by multiplying the actual price by the quantity taken from the table column
    const expectedCalculatedTotal = actualPrice * actualQuantity;
    expect(actualTotal).toBe(expectedCalculatedTotal);

  }
  })

  test('TC - 02 User can remove product from cart', async ({ page }) => {
    await globalPage.navigateToProducts();
    await productsPage.searchForProduct(expectedProducts[0].name);
    await productsPage.addProductToCartByName(expectedProducts[0].name);
    await productsPage.navigateToCart();
    await expect(page.getByRole('link', { name: 'Blue Top' })).toHaveText(expectedProducts[0].name); 
    await productsPage.clickDeleteProduct(expectedProducts[0].name);
    await expect(page.getByText('Cart is empty!')).toBeVisible(); 
  })
});


