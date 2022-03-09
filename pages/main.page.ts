import {PageHelpers} from "../helpers/pageHelpers";
import {mainPageObjects} from "../pageObjects/main";
import {headerPageObjects} from "../pageObjects/header";

export default class MainPage {
  static async assertThatUserIsLoggedIn(): Promise<void> {
    await PageHelpers.waitForSelector(headerPageObjects.logOut)
    await expect(await PageHelpers.isPresent(headerPageObjects.logOut)).toBeTrue('There is no exit btn on main page')
  }

  static async assertThatHelloTextContainsUserName(userName: string): Promise<void> {
    await PageHelpers.waitFor(async () => (await PageHelpers.innerText(mainPageObjects.helloText))?.indexOf(userName) !== -1)
    await expect(await PageHelpers.innerText(mainPageObjects.helloText)).toContainText(userName, "doesn't contain user's name:")
  }

  static async openMainPage() {
    await page.goto(process.env.SITE_URL!)
    const isNavigation = await PageHelpers.waitForSelector(mainPageObjects.root, {timeout: 60000})
    if (!isNavigation) {
      await page.goto(process.env.SITE_URL!)
    }
  }
}
