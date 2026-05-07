import { test, expect } from '@playwright/test';

test.describe("Saucedemo", () => {
  

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
  });

  test("Login - Happy path", async ({ page }) => {
    await expect(page).toHaveURL("/inventory.html");
  });


//   test("Login - Invalid credentials", async ({ page }) => {
//     await page.getByPlaceholder("Username").fill("invalid_user");
//     await page.getByPlaceholder("Password").fill("invalid_password");
//     await page.getByRole("button", { name: "Login" }).click();

//     await expect(page.locator("[data-test='error']")).toBeVisible();
//     })

    test("Add product to cart", async ({ page }) => {
      await page.goto("/inventory.html");
      await page.getByText("Add to cart").first().click();
      await expect(page.locator(".shopping_cart_badge"), "Cart badge should show 1 after adding a product").toHaveText("1");
    });

    test("Remove product from cart", async ({ page }) => {
        await page.goto("/inventory.html");
        await page.getByText("Add to cart").first().click(); // Add to cart
        await expect(page.locator('[data-test="shopping-cart-link"]')).toHaveText("1");
        await page.getByText("Remove").first().click(); // Remove from cart
        await expect(page.locator('[data-test="shopping-cart-link"]')).not.toHaveText("1");
        await expect(page.locator(".shopping_cart_badge"), "Cart badge should not be visible after removing product").not.toBeVisible()
    });

    // test("Empty credentials", async ({ page }) => {
    //     await page.locator('[data-test="login-button"]').click();
    //     await expect(page.locator('[data-test="error"]')).toHaveText("Epic sadface: Username is required");
    //     await page.getByPlaceholder("Username").fill("standard_user");
    //     await page.getByRole("button", { name: "Login" }).click();
    //     await expect(page.locator('[data-test="error"]')).toHaveText("Epic sadface: Password is required");
    //     await page.getByPlaceholder("Username").clear();
    //     await page.getByPlaceholder("Password").fill("secret_sauce");
    //     await page.getByRole("button", { name: "Login" }).click();
    //     await expect(page.locator('[data-test="error"]')).toHaveText("Epic sadface: Username is required");
    // })

        test("Add multiple products to cart", async ({ page }) => {
      await page.goto("/inventory.html");
      await page.getByText("Add to cart").first().click();
      await page.getByText("Add to cart").nth(1).click();
      await page.getByText("Add to cart").nth(2).click();
      await expect(page.locator(".shopping_cart_badge"), "Cart badge should show 3 after adding multiple products").toHaveText("3");
      await page.getByText("Remove").nth(2).click();
      await expect(page.locator(".shopping_cart_badge"), "Cart badge should show 2 after removing one product").toHaveText("2");
    });

    test("Sorting products", async ({ page }) => {
        await page.goto("/inventory.html");
        await page.locator('[data-test="product-sort-container"]').selectOption("hilo");
        const prices = await page.locator(".inventory_item_price").allTextContents();
        console.log("Prices after sorting high to low:", prices); // Debugging output
        const sortedPrices = [...prices].sort((a, b) => parseFloat(b.replace("$", "")) - parseFloat(a.replace("$", "")));
        expect(prices).toEqual(sortedPrices);
        
    })

    test("State after refresh", async ({ page }) => {
        await page.goto("/inventory.html");
        await page.getByText("Add to cart").first().click();
        await expect(page.locator(".shopping_cart_badge"), "Cart badge should show 1 after adding a product").toHaveText("1");
        await page.reload();
        await expect(page.locator(".shopping_cart_badge"), "Cart badge should still show 1 after page refresh").toHaveText("1");

    });


  });

