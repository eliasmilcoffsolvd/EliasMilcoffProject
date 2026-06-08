import { type Locator, type Page } from "@playwright/test";

export class ProductsPage {
    readonly page: Page;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly firstProductName: Locator;
    readonly firstProductPage : Locator;
    readonly hoverFirstProduct: Locator;
    readonly clickAddToCart: Locator;
    readonly goToCart: Locator;
    
    
    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.getByPlaceholder('Search Product');
        this.searchButton = page.locator('#submit_search');
        this.firstProductName = page.locator('.productinfo.text-center p').first();
        this.firstProductPage = page.getByRole('link', { name: ' View Product' }).first();
        this.hoverFirstProduct = page.locator('.product-image-wrapper').first();
        this.clickAddToCart = page.locator('.overlay-content .add-to-cart').first();
        this.goToCart = page.getByRole('link', { name: 'View Cart' });
        // this.firstProductPrice = page.locator('.productinfo.text-center .price');
        // this.firstProductAvailability = page.locator('.productinfo.text-center .availability');
    }

    async searchForProduct(productName: string) {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
    }

    async getFirstProductDetails() {
        const name = await this.firstProductName.textContent();
        // const price = await this.firstProductPrice.textContent();
        // const availability = await this.firstProductAvailability.textContent();
        return { name} //, price, availability };
    }

    async openFirstProductPage() {
        await this.firstProductPage.click();
    }

    async addFirstProductToCart() {
        await this.hoverFirstProduct.hover();
        await this.clickAddToCart.click();
    }

    async navigateToCart() {
        await this.goToCart.click();
    }

    async clickDeleteProduct(productName: string) {
            const productRow = this.page.getByRole('row', { name: `Product Image ${productName}` });
            await productRow.locator('.cart_quantity_delete').click();
    }

    async addProductToCartByName(productName: string) {
        const productCard = this.page.locator('.product-image-wrapper').filter({ hasText: productName });
        await productCard.hover();
        await productCard.locator('.overlay-content .add-to-cart').click();
    }
}   
