import { type Locator, type Page } from "@playwright/test";


export class ContactPage {
    readonly page: Page;
    readonly nameInput: Locator
    readonly emailInput: Locator;
    readonly messageInput: Locator;
    readonly fileUploadInput: Locator
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.getByPlaceholder('Name');
        this.emailInput = page.getByRole('textbox', { name: 'Email', exact: true });
        this.messageInput = page.getByPlaceholder('Message');
        this.fileUploadInput = page.getByRole('button', { name: 'Choose File' });
        this.submitButton = page.getByRole('button', { name: 'Submit' });
    }

    async fillname(name: string) {
        await this.nameInput.fill(name);
    }
    
    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async fillMessage(message: string) {
        await this.messageInput.fill(message);
    }

    async uploadFile(filePath: string) {
        await this.fileUploadInput.setInputFiles(filePath);
    }

    async submitForm() {
        await this.submitButton.click();
    }


}