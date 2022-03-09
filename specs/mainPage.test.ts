import 'expect-puppeteer'
import {testTry} from "../helpers/testTry";
import {Severity} from "jest-allure/dist/Reporter";
import MainPage from "../pages/main.page";

declare const reporter: any;

describe('Contact book', () => {
  beforeAll(async () => {
    await MainPage.openMainPage()
  }, 60000)

  testTry('should display "Книга контактов" text on page', async () => {
    reporter.severity(Severity.Normal);
    reporter.description('Should display "Книга контактов" text on the page');

    reporter.startStep("assert text on the page")
    await expect(page).toMatch('Книга контактов')
    reporter.endStep()
  })

  testTry('should display "Книга контактов" text on page', async () => {
    reporter.severity(Severity.Normal);
    reporter.description('This test is example of failed test');

    reporter.startStep("assert text on the page")
    await expect(page).toMatch('Книга контактов')
    reporter.endStep()
  })
})
