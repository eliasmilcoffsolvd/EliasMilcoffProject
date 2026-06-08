/// Website choosen: automation exercise website: https://automationexercise.com/
import { test, expect } from '@playwright/test';
import expectedProducts from '../data/products.json';
import users from '../data/users.json';
import { GlobalPage } from '../pages/GlobalPage';
import { ProductsPage } from '../pages/ProductsPage';
import { ContactPage } from '../pages/ContactPage';
import { RegisterLoginPage } from '../pages/RegisterLoginPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage'

test.describe('Register - Test cases', () => {
  let globalPage: GlobalPage;
  let productsPage: ProductsPage;
  let contactPage: ContactPage;
  let registerLoginPage: RegisterLoginPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let paymentPage: PaymentPage;
  const randomNumber = Math.floor(Math.random() * 99999);
  const randomEmail = `${users[0].name}${randomNumber}@yopmail.com`;

  test.beforeEach(async ({ page }) => {
    globalPage = new GlobalPage(page);
    productsPage = new ProductsPage(page);
    contactPage = new ContactPage(page);
    registerLoginPage = new RegisterLoginPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    paymentPage = new PaymentPage(page)

    await page.route('**/*', (route) => {
    const url = route.request().url();

    if (url.includes('googleads') || url.includes('doubleclick') || url.includes('adservice')) {
      route.abort(); 
    } else {
      route.continue(); 
    }
  });
    await page.goto('/', { 
      waitUntil: 'domcontentloaded', 
      timeout: 30000 
    });
  });


  //// --- EXTRAS TESTS ---

  test('Register - TC EXTRA 01 - User can register and login successfully', async ({ page }) => {
    await globalPage.navigateToRegisterLogin();
    await registerLoginPage.fillRegistrationForm(users[0].name, randomEmail);
    await registerLoginPage.signUpButton.click();
    await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toBeVisible();
    await page.getByRole('radio', { name: 'Mr.', checked: false }).click();
    await registerLoginPage.fillRegistrationDetails(users[0].password, users[0].dayOfBirth, users[0].monthOfBirth, users[0].yearOfBirth);
    await registerLoginPage.fillAddressDetails(users[0].name, users[0].name, users[0].address, users[0].country, users[0].state, users[0].city, users[0].zipCode, users[0].mobileNumber);
    await registerLoginPage.createAccountButton.click();
    await expect(page.getByRole('heading', { name: 'Account Created!' })).toBeVisible();
    await page.getByRole('link', { name: 'Continue' }).click();
    await expect(page.locator(`a:has-text("Logged in as")`)).toBeVisible();
  });

  test('Register - TC EXTRA 02 - User cannot register with existing email', async ({ page }) => {
    await globalPage.navigateToRegisterLogin();
    await registerLoginPage.fillRegistrationForm(users[0].name, users[0].email);
    await registerLoginPage.signUpButton.click();
    await expect(page.getByText('Email Address already exist!')).toBeVisible();
  });

  test('Register - TC EXTRA 03 - User cannot register with invalid email', async  ({page}) => {
    await globalPage.navigateToRegisterLogin();
    await registerLoginPage.fillRegistrationForm('xxx','xxx')
    await registerLoginPage.signUpButton.click()
    await expect(page.getByText('Enter Account Information', { exact: true })).not.toBeVisible()
  })

  test('Register - TC EXTRA 04 - User cannot create an account with empty account/address information', async ({ page}) => {
    await globalPage.navigateToRegisterLogin();
    await registerLoginPage.fillRegistrationForm(users[0].name, randomEmail)
    await registerLoginPage.signUpButton.click()
    await registerLoginPage.createAccountButton.click();
    await expect(page.getByRole('heading', { name: 'Account Created!' })).not.toBeVisible();
  })

   test('Register - TC EXTRA 05 - User is able to delete account', async ({ page}) => {
    await globalPage.navigateToRegisterLogin();
    await registerLoginPage.fillRegistrationForm(users[0].name, randomEmail);
    await registerLoginPage.signUpButton.click();
    await expect(page.getByRole('heading', { name: 'Enter Account Information' })).toBeVisible();
    await page.getByRole('radio', { name: 'Mr.', checked: false }).click();
    await registerLoginPage.fillRegistrationDetails(users[0].password, users[0].dayOfBirth, users[0].monthOfBirth, users[0].yearOfBirth);
    await registerLoginPage.fillAddressDetails(users[0].name, users[0].name, users[0].address, users[0].country, users[0].state, users[0].city, users[0].zipCode, users[0].mobileNumber);
    await registerLoginPage.createAccountButton.click();
    await expect(page.getByRole('heading', { name: 'Account Created!' })).toBeVisible();
    await page.getByRole('link', { name: 'Continue' }).click();
    await globalPage.navigateToDeleteAccount()
    await expect(page.getByText('Account Deleted!', { exact: true })).toBeVisible()
  })

});
