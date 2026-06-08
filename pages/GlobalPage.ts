import { type Locator, type Page } from "@playwright/test";

export class GlobalPage {
    readonly page: Page;
    readonly productsLink: Locator;
    readonly contactUsLink: Locator;
    readonly registerLoginLink: Locator;
    readonly suscribeEmailInput: Locator;
    readonly deleteAccountLink: Locator;


    constructor(page: Page) {
        this.page = page;
        this.productsLink = page.getByRole('link', { name: 'Products' });
        this.contactUsLink = page.getByRole('link', { name: 'Contact Us' });
        this.registerLoginLink = page.getByRole('link', { name: 'Signup / Login' });
        this.suscribeEmailInput = page.locator('#susbscribe_email');
        this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
    }

    async navigateToProducts() {
        await this.productsLink.click();
    }

    async navigateToContactUs() {
        await this.contactUsLink.click();
    }

    async navigateToRegisterLogin() {
        await this.registerLoginLink.click();
    }

        async suscribeToNewsletter(email: string) {
        await this.suscribeEmailInput.fill(email);
        await this.page.locator('#subscribe').click();
    }

    async navigateToDeleteAccount(){
        await this.deleteAccountLink.click()
    }

}