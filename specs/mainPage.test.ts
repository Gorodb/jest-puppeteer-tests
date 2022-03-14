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

  // this test will fail because on the page text should be equal "Книга контактов" without 1 in the end
  testTry('should display "Книга контактов 1" text on page', async () => {
    reporter.severity(Severity.Normal);
    reporter.description('This test is example of failed test');

    reporter.startStep("assert text on the page")
    await expect(page).toMatch('Книга контактов 1')
    reporter.endStep()
  })
})
