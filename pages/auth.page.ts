import {PageHelpers} from "../helpers/pageHelpers";
import {authPageObjects} from "../pageObjects/auth";
import {headerPageObjects} from "../pageObjects/header";
import SoftAssertion from "../helpers/softAssertion";
import {IUser} from "../types/user.type";
import MainPage from "./main.page";

export default class AuthPage {
  static async openAuthPageByUrl(): Promise<void> {
    await MainPage.openMainPage()

    if (await PageHelpers.isPresent(headerPageObjects.logOut)) {
      await PageHelpers.click(headerPageObjects.logOut)
    }
  }

  static async switchOnRegPage(): Promise<void> {
    await PageHelpers.click(authPageObjects.registerLink, true)
  }

  static async regUser({name, email, password}: IUser): Promise<void> {
    await PageHelpers.waitForSelector(authPageObjects.nameInput)
    await PageHelpers.type(authPageObjects.nameInput, name)
    await PageHelpers.type(authPageObjects.emailInput, email)
    await PageHelpers.type(authPageObjects.passwordInput, password)
    await PageHelpers.type(authPageObjects.passwordAgainInput, password)
  }

  static async clickOnSubmitBtn(): Promise<void> {
    await PageHelpers.click(authPageObjects.submitInput)
  }

  static async logout(): Promise<void> {
    await PageHelpers.click(headerPageObjects.logOut)
  }

  static async assertThatUserIsLoggedOut() {
    await PageHelpers.waitFor(() => page.url().includes('/login'), 2000)
    const softAssertions = new SoftAssertion()
    softAssertions.expect(await PageHelpers.isPresent(authPageObjects.emailInput))
      .toBeTrue('On auth page should be displayed login by email input')
    softAssertions.expect(page.url())
      .toContainText('/login', `Page url: "${page.url()}" should contain text "/login"`)
    await softAssertions.assertAll()
  }

  static async inputEmail(email: string) {
    await PageHelpers.clearInput(authPageObjects.emailInput);
    await PageHelpers.type(authPageObjects.emailInput, email)
  }

  static async inputPassword(email: string) {
    await PageHelpers.clearInput(authPageObjects.passwordInput);
    await PageHelpers.type(authPageObjects.passwordInput, email)
  }
}
