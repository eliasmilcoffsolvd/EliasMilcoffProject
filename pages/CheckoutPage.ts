import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page
    readonly placeOrderButton: Locator

    constructor(page: Page) {
        this.page = page;
        this.placeOrderButton = page.locator('#cart_items').getByRole('link', { name: 'Place Order' });
    }

    async placeOrder() {
        await this.placeOrderButton.click();
    }

}