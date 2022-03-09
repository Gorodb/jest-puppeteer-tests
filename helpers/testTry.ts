import {Status} from "jest-allure/dist/Reporter";
import {PageHelpers} from "./pageHelpers";

declare const reporter: any;

export const testTry = async (name: string, fn: () => any, timeout = 10000) =>
  it(name, async () => {
    try {
      await fn();
    } catch (error) {
      console.log(error);
      await PageHelpers.makeAllureScreenshot();
      reporter.endStep(Status.Failed);
      throw error;
    }
  }, timeout);
