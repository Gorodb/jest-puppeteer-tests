import {Severity} from "jest-allure/dist/Reporter";

import DataHelper from "../helpers/dataHelper";
import AuthPage from "../pages/auth.page";
import MainPage from "../pages/main.page";
import {IUser} from "../types/user.type";

declare const reporter: any;

const user: IUser = {
  email: DataHelper.randomValidEmail(),
  password: '123456',
  name: 'Tester'
}

describe(`Example test`, () => {
  beforeAll(async () => {
    await AuthPage.openAuthPageByUrl()
  })

  test('Should be able to register', async () => {
    reporter.description('Open search page test and assert search input')
    reporter.severity(Severity.Blocker)

    reporter.startStep('Open register page');
    await AuthPage.switchOnRegPage()
    reporter.endStep();

    reporter.startStep('Register user');
    await AuthPage.regUser(user)
    await AuthPage.clickOnSubmitBtn()
    reporter.endStep();

    reporter.startStep('Assert that user is logged in');
    await MainPage.assertThatUserIsLoggedIn()
    reporter.endStep();
  })

  test('Welcome text should contain user name', async () => {
    reporter.description('Assert that welcome text in header contain user name')
    reporter.severity(Severity.Minor)

    reporter.startStep('Assertion');
    await MainPage.assertThatHelloTextContainsUserName(user.name)
    reporter.endStep();
  })

  test('Should be able to logout', async () => {
    reporter.description('Assert that user could logout')
    reporter.severity(Severity.Critical)

    reporter.startStep('Click on logout');
    await AuthPage.logout()
    reporter.endStep();

    reporter.startStep('Assert that user is logged out');
    await AuthPage.assertThatUserIsLoggedOut()
    reporter.endStep();
  })

  test.each([
    {
      email: DataHelper.randomValidEmail(),
      password: user.password,
      message: `Should not login with wrong email and correct password`
    }, {
      email: user.email,
      password: DataHelper.randomInt(100000, 999999),
      message: `Should not login with wrong password and correct email`
    }, {
      email: user.email.replace('@mailinator.com', ''),
      password: DataHelper.randomInt(100000, 999999),
      message: `Should not login with incorrect email`
    }, {
      email: '',
      password: DataHelper.randomInt(100000, 999999),
      message: `Should not login without email`
    }, {
      email: user.email,
      password: '',
      message: `Should not login without password`
    },
  ])(`$message`, async ({email, password}) => {
    reporter.description('Asset that user is not logged in with wrong email/password pair')
    reporter.severity(Severity.Critical)

    reporter.startStep('Add email');
    await AuthPage.inputEmail(email)
    reporter.endStep();

    reporter.startStep('Add password');
    await AuthPage.inputPassword(password.toString())
    reporter.endStep();

    reporter.startStep('Submit');
    await AuthPage.clickOnSubmitBtn()
    reporter.endStep();

    reporter.startStep('Assert that user is logged out');
    await AuthPage.assertThatUserIsLoggedOut()
    reporter.endStep();
  })
})
