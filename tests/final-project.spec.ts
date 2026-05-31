/// Website choosen: automation exercise website: https://automationexercise.com/

import { test, expect } from '@playwright/test';
import expectedProducts from '../data/products.json';
import users from '../data/users.json';

test.describe('Final Project - Automation Exercise Website', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC - 01 User can search for a product and see relevant results', async ({ page }) => {

    await expect(page.getByRole('heading', { name: 'AutomationExercise' })).toBeVisible(); //  checks if the homepage is loaded successfully
    await page.getByRole('link', { name: ' Products' }).click();
    await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible(); //  checks if ALL PRODUCTS page is loaded successfully
    await page.getByPlaceholder('Search Product').fill(expectedProducts[0].name);
    await page.locator('#submit_search').click();
    await expect(page.getByRole('heading', { name: 'Searched Products' })).toBeVisible(); //  checks if the searched products page is loaded successfully
    const productNames = page.locator('.productinfo.text-center p');
    const productCount = await productNames.count();
    for (let i = 0; i < productCount; i++) {
      const productName = await productNames.nth(i).textContent();
      expect(productName).toContain(expectedProducts[0].name); //  checks if the product name contains the search term "short"
      console.log(`✅ Fully verified`)
    }
  });

  test('TC - 02 User can open product details and verify name, price, availability' , async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'AutomationExercise' })).toBeVisible(); //  checks if the homepage is loaded successfully
    await page.getByRole('link', { name: ' Products' }).click();
    await expect(page.getByRole('heading', { name: 'All Products' })).toBeVisible();
    await page.getByRole('link', { name: ' View Product' }).first().click();
    const productName = page.locator('.product-information h2');
    await expect(productName).not.toBeNull(); //  checks if the product name element is present
    await expect(productName).toBeVisible(); //  checks if the product name is displayed correctly
    await expect(page.getByText('Rs.')).toBeVisible(); //  checks if the product price is displayed correctly
    await expect(page.getByText('Availability:')).toBeVisible(); //  checks if the product availability is displayed correctly
    await expect(page.getByText('Condition:')).toBeVisible(); //  checks if the product condition is displayed correctly
    await expect(page.getByText('Brand:')).toBeVisible(); //  checks if the product brand is displayed correctly
    console.log(`✅ Fully verified`)
  });

  test('TC - 03 User can add multiple products to cart and verify price/quantity/total', async ({ page }) => {

  await expect(page.getByRole('heading', { name: 'AutomationExercise' })).toBeVisible(); 
  await page.getByRole('link', { name: ' Products' }).click();
  for (let i = 0; i < expectedProducts.length; i++) {
    const product = expectedProducts[i];
    await page.getByPlaceholder('Search Product').fill(product.name);
    await page.locator('#submit_search').click();
    await page.locator('.product-image-wrapper').first().hover();
    await page.locator('.overlay-content .add-to-cart').first().click();
    if (i === expectedProducts.length - 1) {
      await page.getByRole('link', { name: 'View Cart' }).click();
    } else {
      await page.getByRole('button', { name: 'Continue Shopping' }).click();
    }
  }
  const productRows = page.locator('#cart_info_table tbody tr[id^="product-"]');
  await expect(productRows).toHaveCount(expectedProducts.length);
  for (const expectedProduct of expectedProducts) {
    const matchingRow = productRows.filter({ hasText: expectedProduct.name });
    await expect(matchingRow).toBeVisible();
    await expect(matchingRow.getByRole('link', { name: expectedProduct.name })).toBeVisible();
    const priceText = await matchingRow.locator('.cart_price p').innerText();
    const quantityText = await matchingRow.locator('.cart_quantity button').innerText();
    const totalText = await matchingRow.locator('.cart_total_price').innerText();
    const actualPrice = parseInt(priceText.replace(/\D/g, ''), 10);
    const actualQuantity = parseInt(quantityText.replace(/\D/g, ''), 10);
    const actualTotal = parseInt(totalText.replace(/\D/g, ''), 10);
    expect(actualPrice).toBe(expectedProduct.price);
    expect(actualQuantity).toBe(expectedProduct.quantity);
    expect(actualTotal).toBe(expectedProduct.price * expectedProduct.quantity);
    console.log(`✅ Fully verified: ${expectedProduct.name} (Price: ${actualPrice}, Qty: ${actualQuantity}, Total: ${actualTotal})`);
  }
  })

  test('TC - 04 User can remove product from cart', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'AutomationExercise' })).toBeVisible();
    await page.getByRole('link', { name: ' Products' }).click();
    await page.getByPlaceholder('Search Product').fill(`${expectedProducts[0].name}`);
    await page.locator('#submit_search').click();
    await page.locator('.product-image-wrapper').first().hover();
    await page.locator('.overlay-content .add-to-cart').first().click();
    await page.getByRole('link', { name: 'View Cart' }).click();
    await expect(page.getByRole('link', { name: 'Blue Top' })).toHaveText(expectedProducts[0].name); //  checks if the correct product is added to the cart
    await page.getByRole('row', { name: 'Product Image Blue Top Women' }).locator('.cart_quantity_delete').click();
    await expect(page.getByRole('link', { name: 'Blue Top' })).not.toBeVisible(); //  checks if the product is removed from the cart
    console.log(`✅ Fully verified`)
  })

  test('TC - 05 User can submit contact form with file upload', async ({ page }) => {
    const filePath = './data/testFile.txt';
    
    await expect(page.getByRole('heading', { name: 'AutomationExercise' })).toBeVisible();
    await page.getByRole('link', { name: 'Contact Us' }).click();
    await expect(page.getByRole('heading', { name: 'Get In Touch' })).toBeVisible(); //  checks if the contact us page is loaded successfully
    await page.getByPlaceholder('Name').fill(users[0].name);
    await page.getByRole('textbox', { name: 'Email', exact: true }).fill(users[0].email);
    await page.getByPlaceholder('Message').fill('Hello, im testing the site');
    await page.getByRole('button', { name: 'Choose File' }).setInputFiles(filePath); //  uploads the file to the contact form
    await page.getByRole('button', { name: 'Submit' }).click();
    page.once('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Press OK to proceed');
        await dialog.accept();
        console.log(`✅ Fully verified`)
        });   
  })

})

