import { Locator, Page } from '@playwright/test';

export class PaymentPage {
    readonly page: Page
    readonly nameOnCardInput: Locator;
    readonly cardNumberInput: Locator;
    readonly cvcInput: Locator;
    readonly expiryMonthInput: Locator;
    readonly expiryYearInput: Locator;
    readonly payAndConfirmOrderButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameOnCardInput = page.locator('[name="name_on_card"]');
        this.cardNumberInput = page.locator('[name="card_number"]');
        this.cvcInput = page.getByRole('textbox', { name: 'ex. 311' });
        this.expiryMonthInput = page.getByRole('textbox', { name: 'MM' });
        this.expiryYearInput = page.getByRole('textbox', { name: 'YYYY' });
        this.payAndConfirmOrderButton = page.getByRole('button', { name: 'Pay and Confirm Order' });

    }

    async fillPaymentDetails(nameOnCard: string, cardNumber: string, cvc: string, expiryMonth: string, expiryYear: string) {
        await this.nameOnCardInput.fill(nameOnCard);
        await this.cardNumberInput.fill(cardNumber);
        await this.cvcInput.fill(cvc);
        await this.expiryMonthInput.fill(expiryMonth);
        await this.expiryYearInput.fill(expiryYear);
    }

    async submitPayment() {
        await this.payAndConfirmOrderButton.click();
    }
}

