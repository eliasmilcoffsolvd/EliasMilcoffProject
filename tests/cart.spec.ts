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

//   test('TC - 01 User can add multiple products to cart and verify price/quantity/total', async ({ page }) => {

test('TC - 01 User can add multiple products to cart and verify price/quantity/total', async ({ page }) => {

  // Search and add the first product with a specific quantity from data
    await test.step('Add first product to cart with custom quantity', async () => {
    await globalPage.navigateToProducts();
    await productsPage.searchForProduct(expectedProducts[0].name);
    
    // Go to product details page (PDP), set custom quantity, and add to cart
    await page.getByRole('link', { name: 'View Product' }).click();
    await page.locator('#quantity').fill(expectedProducts[0].qty.toString());
    await page.getByRole('button', { name: 'Add to cart' }).click();
    await page.getByRole('button', { name: 'Continue Shopping' }).click();
  });

    // Search and add the second product with its respective quantity
    await test.step('Add second product to cart', async () => {
    await globalPage.navigateToProducts();
    await productsPage.searchForProduct(expectedProducts[1].name);
    
    // Add directly to the cart from the products listing view
    await productsPage.addProductToCartByName(expectedProducts[1].name);
  });

    // Navigate to the cart page and verify the row count matches expected items
    await test.step('Navigate to Cart and verify initial row count', async () => {
    await productsPage.navigateToCart();
    
    // Locate the product rows in the cart table and assert the count matches the data array length
    const productRows = page.locator('#cart_info_table tbody tr[id^="product-"]');
    await expect(productRows).toHaveCount(expectedProducts.length);  
  });

    // Dynamically audit calculations (price, quantity, total) for each row 
    await test.step('Audit cart calculations for each product', async () => {
      const productRows = page.locator('#cart_info_table tbody tr[id^="product-"]');
    
      for (const expectedProduct of expectedProducts) {
      // Find the specific row containing the expected product name
      const matchingRow = productRows.filter({ hasText: expectedProduct.name });
      
      // Verify the product row is visible and contains the correct link text
      await expect(matchingRow).toBeVisible();
      await expect(matchingRow.getByRole('link', { name: expectedProduct.name })).toBeVisible();

      // Extract raw text values from the current table row
      const priceText = await matchingRow.locator('.cart_price p').innerText();
      const quantityText = await matchingRow.locator('.cart_quantity button').innerText();
      const totalText = await matchingRow.locator('.cart_total_price').innerText();

      // Convert extracted text values to numbers by stripping out currency symbols, commas, or spaces
      const actualPrice = parseInt(priceText.replace(/\D/g, ''), 10);
      const actualQuantity = parseInt(quantityText.replace(/\D/g, ''), 10);
      const actualTotal = parseInt(totalText.replace(/\D/g, ''), 10);
      
      // Validate that the unit price displayed on screen matches the dataset
      expect(actualPrice).toBe(expectedProduct.price);

      // Validate that the actual quantity matches the 'qty' property defined in the dataset
      expect(actualQuantity).toBe(expectedProduct.qty);

      // Calculate the expected line-item total and assert it matches the actual total on screen
      const expectedCalculatedTotal = actualPrice * actualQuantity;
      expect(actualTotal).toBe(expectedCalculatedTotal);
    }
  });


});

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


