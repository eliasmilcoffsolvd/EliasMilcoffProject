import { type Locator, type Page } from "@playwright/test";

export class RegisterLoginPage {
    readonly page: Page
    readonly nameRegInput: Locator;
    readonly emailRegInput: Locator;
    readonly emailLoginInput: Locator;
    readonly passwordLoginInput: Locator
    readonly signUpButton: Locator;
    readonly loginButton: Locator;
    readonly passwordRegInput: Locator;
    readonly dayOfBirthSelect: Locator;
    readonly monthOfBirthSelect: Locator;
    readonly yearOfBirthSelect: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly addressInput: Locator;
    readonly countrySelect: Locator;
    readonly stateInput: Locator
    readonly cityInput: Locator;
    readonly zipCodeInput: Locator
    readonly mobileNumberInput: Locator;
    readonly createAccountButton: Locator;

    
    constructor(page: Page) {
        this.page = page;
        this.nameRegInput = page.getByPlaceholder('Name');
        this.emailRegInput = page.locator('[data-qa="signup-email"]');
        this.emailLoginInput = page.locator('[data-qa="login-email"]');;
        this.passwordLoginInput = page.getByPlaceholder('Password');
        this.signUpButton = page.getByRole('button', { name: 'Signup' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.passwordRegInput = page.locator('[data-qa="password"]');
        this.dayOfBirthSelect = page.locator('[data-qa="days"]');
        this.monthOfBirthSelect = page.locator('[data-qa="months"]');
        this.yearOfBirthSelect = page.locator('[data-qa="years"]');
        this.firstNameInput = page.locator('[data-qa="first_name"]');
        this.lastNameInput = page.locator('[data-qa="last_name"]');
        this.addressInput = page.locator('[data-qa="address"]');
        this.countrySelect = page.locator('[data-qa="country"]');
        this.stateInput = page.locator('[data-qa="state"]');
        this.cityInput = page.locator('[data-qa="city"]');
        this.zipCodeInput = page.locator('[data-qa="zipcode"]');
        this.mobileNumberInput = page.locator('[data-qa="mobile_number"]');
        this.createAccountButton = page.getByRole('button', { name: 'Create Account' });

    }

    async fillRegistrationForm(name: string, email: string) {
        await this.nameRegInput.fill(name);
        await this.emailRegInput.fill(email);
    }

    async fillRegistrationDetails(password: string, dayOfBirth: string, monthOfBirth: string, yearOfBirth: string) {
        await this.passwordRegInput.fill(password);
        await this.dayOfBirthSelect.selectOption(dayOfBirth);
        await this.monthOfBirthSelect.selectOption(monthOfBirth);
        await this.yearOfBirthSelect.selectOption(yearOfBirth);
    }

    async fillAddressDetails(firstName: string, lastName: string, address: string, country: string, state: string, city: string, zipCode: string, mobileNumber: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.addressInput.fill(address);
        await this.countrySelect.selectOption(country);
        await this.stateInput.fill(state);
        await this.cityInput.fill(city);
        await this.zipCodeInput.fill(zipCode);
        await this.mobileNumberInput.fill(mobileNumber);
    }

    async login(email: string, password: string) {
        await this.emailLoginInput.fill(email);
        await this.passwordLoginInput.fill(password);
        await this.loginButton.click();
    }

}
