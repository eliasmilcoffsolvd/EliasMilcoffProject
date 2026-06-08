import { Locator, Page } from "@playwright/test";

export class CartPage {
    readonly page: Page;
    readonly proceedToCheckoutButton: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.proceedToCheckoutButton = page.getByText('Proceed To Checkout', { exact: true });

    }

    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click();
    }
}