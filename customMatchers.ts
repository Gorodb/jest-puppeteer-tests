import { Status } from 'jest-allure/dist/Reporter';
import {PageHelpers} from './helpers/pageHelpers';

declare const reporter: any;

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveSelector(
        options: {
          state?: 'attached' | 'detached' | 'visible' | 'hidden';
          timeout?: number;
        },
        errorMessage: string,
      ): Promise<CustomMatcherResult>;
      toBeTrue(errorMessage: string): Promise<CustomMatcherResult>;
      toBeFalse(errorMessage: string): Promise<CustomMatcherResult>;
      toEqual(expected: any, errorMessage: string): Promise<CustomMatcherResult>;
      toBeEqual(expected: any, errorMessage: string): Promise<CustomMatcherResult>;
      toBeOneOf(expected: any[], errorMessage?: string): Promise<CustomMatcherResult>;
      notToEqual(expected: any, errorMessage: string): Promise<CustomMatcherResult>;
      toContainText(expected: string | number, errorMessage: string): Promise<CustomMatcherResult>;
      toBeGreater(expected: number, errorMessage: string): Promise<CustomMatcherResult>;
      toBeLess(expected: number, errorMessage: string): Promise<CustomMatcherResult>;
      toBeInCollection(expected: number): Promise<CustomMatcherResult>;
      toBeInFavorites(expected: number): Promise<CustomMatcherResult>;
    }
  }
}

expect.extend({
  async toHaveSelector(selector, options = {}, errorMessage) {
    try {
      await page.waitForSelector(selector, options);
      return {
        pass: true,
        message: () => `${selector} найден на странице.`,
      };
    } catch {
      await PageHelpers.makeAllureScreenshot();
      reporter.endStep(Status.Failed);
      return {
        pass: false,
        message: () => errorMessage || `${selector} не был найден на странице.`,
      };
    }
  },
});

expect.extend({
  async toBeTrue(actual, errorMessage) {
    const pass = actual === true;
    if (pass) {
      return {
        message: () => errorMessage || `'${actual}' не равно 'false'`,
        pass: true,
      };
    }
    await PageHelpers.makeAllureScreenshot();
    reporter.endStep(Status.Failed);
    return {
      message: () => errorMessage || `'${actual}' не равно 'true'`,
      pass: false,
    };
  },
});

expect.extend({
  async toBeFalse(actual, errorMessage) {
    const pass = actual === false;
    if (pass) {
      return {
        message: () => errorMessage || `'${actual}' не равно 'true'`,
        pass: true,
      };
    }
    await PageHelpers.makeAllureScreenshot();
    reporter.endStep(Status.Failed);
    return {
      message: () => errorMessage || `'${actual}' не равно 'false'`,
      pass: false,
    };
  },
});

expect.extend({
  async toBeGreater(actual: any, expected: any, errorMessage: string) {
    const pass = actual > expected;
    if (pass) {
      return {
        message: () => `'${actual}' больше '${expected}'`,
        pass: true,
      };
    }
    await PageHelpers.makeAllureScreenshot();
    reporter.endStep(Status.Failed);
    return {
      message: () =>
        `'${actual}' ${errorMessage} '${expected}'` || `'${actual}' должно быть больше '${expected}'`,
      pass: false,
    };
  },
});

expect.extend({
  async toBeLess(actual: any, expected: any, errorMessage: string) {
    const pass = actual < expected;
    if (pass) {
      return {
        message: () => `'${actual}' меньше '${expected}'`,
        pass: true,
      };
    }
    await PageHelpers.makeAllureScreenshot();
    reporter.endStep(Status.Failed);
    return {
      message: () =>
        `'${actual}' ${errorMessage} '${expected}'` || `'${actual}' должно быть меньше чем '${expected}'`,
      pass: false,
    };
  },
});

expect.extend({
  async toEqual(actual: any, expected: any, errorMessage: string) {
    const pass = actual === expected;
    if (pass) {
      return {
        message: () => `'${actual}' равно '${expected}'`,
        pass: true,
      };
    }
    await PageHelpers.makeAllureScreenshot()
    reporter.endStep(Status.Failed);
    return {
      message: () =>
        `'${actual}' ${errorMessage} '${expected}'` || `'${actual}' не равно '${expected}'`,
      pass: false,
    };
  },
});

expect.extend({
  async toBeEqual(actual: any, expected: any, errorMessage: string) {
    const pass = actual === expected;
    if (pass) {
      return {
        message: () => `'${actual}' равно '${expected}'`,
        pass: true,
      };
    }
    await PageHelpers.makeAllureScreenshot()
    reporter.endStep(Status.Failed);
    return {
      message: () =>
        `'${actual}' ${errorMessage} '${expected}'` || `'${actual}' не равно '${expected}'`,
      pass: false,
    };
  },
});

expect.extend({
  async toBeOneOf(actual: any, expected: any[], errorMessage?: string) {
    const pass = expected.indexOf(actual) !== -1;
    if (pass) {
      return {
        message: () => `'${expected}' не содержит в себе '${actual}'`,
        pass: true,
      };
    }
    await PageHelpers.makeAllureScreenshot()
    reporter.endStep(Status.Failed);
    return {
      message: () =>
        `'${actual}' ${errorMessage} '${expected}'` || `'В ${expected}' не отсутствует значение '${actual}'`,
      pass: false,
    };
  },
});

expect.extend({
  async notToEqual(actual: any, expected: any, errorMessage: string) {
    const pass = actual !== expected;
    if (pass) {
      return {
        message: () => `'${actual}' не равно '${expected}'`,
        pass: true,
      };
    }
    await PageHelpers.makeAllureScreenshot()
    reporter.endStep(Status.Failed);
    return {
      message: () =>
        `'${actual}' ${errorMessage} '${expected}'` || `'${actual}' равно '${expected}'`,
      pass: false,
    };
  },
});

expect.extend({
  async toBeInFavorites(actual: any, expected: any, errorMessage: string) {
    const pass = !expected.length ? false : expected.reduce(
      (acc: boolean, value: any) => value[value.type].id == actual ? true : acc, false
    )
    if (pass) {
      return {
        message: () => `'${actual}' в избранном'`,
        pass: true,
      };
    }
    await PageHelpers.makeAllureScreenshot()
    reporter.endStep(Status.Failed);
    return {
      message: () =>
        `${actual} должно быть в избранном`,
      pass: false,
    };
  },
});

expect.extend({
  async toBeInCollection(actual: any, expected: [any]) {
    const pass = expected.indexOf(actual) !== -1
    if (pass) {
      return {
        message: () => `В массиве '${expected}' все коллекции '${actual}'`,
        pass: true,
      };
    }
    await PageHelpers.makeAllureScreenshot();
    reporter.endStep(Status.Failed);
    return {
      message: () =>
        `В массиве коллекций '${expected}' отсутствует коллекция '${actual}'`,
      pass: false,
    };
  },
});

expect.extend({
  async toContainText(actual: string, expected: string | number, errorMessage: string) {
    const pass = actual.indexOf(expected.toString()) !== -1;
    if (pass) {
      return {
        message: () => `'${expected}' содержит '${actual}'`,
        pass: true,
      };
    }
    await PageHelpers.makeAllureScreenshot();
    reporter.endStep(Status.Failed);
    return {
      message: () =>
        `'${expected}' ${errorMessage} '${actual}'` || `'${expected}' не содержит '${actual}'`,
      pass: false,
    };
  },
});
