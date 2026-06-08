import { type Locator, type Page } from "@playwright/test";

export class ProductDetailPage {
    readonly page: Page;
    readonly yourNameInput: Locator;
    readonly emailInput: Locator;
    readonly reviewMessageInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.yourNameInput = page.getByRole('textbox', { name: 'Your Name' });
        this.emailInput = page.locator('#email');
        this.reviewMessageInput = page.locator('#review');
        this.submitButton = page.locator('#button-review');
    }

    async fillName(name: string) {
        await this.yourNameInput.fill(name)
    }

    async fillEmail(email: string) {
        await this.emailInput.fill(email)
    }

    async fillReview(review: string) {
        await this.reviewMessageInput.fill(review)
    }

    async submitReview() {
        await this.submitButton.click()
    }




}