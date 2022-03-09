import {ElementHandle, MouseWheelOptions, WaitForOptions} from "puppeteer";

declare const reporter: any;

interface WithWait {
  withWait?: boolean;
  timeout?: number;
}

export class PageHelpers {
  static async makeAllureScreenshot(name = 'screenshot'): Promise<void> {
    const screenshot = await page.screenshot();
    reporter.addAttachment(name, screenshot, 'image/png');
  }

  static async isPresent(element: string, withWait = false, timeout = 5000): Promise<boolean> {
    if (withWait) {
      await this.waitForSelector(element, {timeout})
    }
    return !!(await page.$(element));
  }

  static async isAllPresent(elements: string): Promise<boolean> {
    try {
      return (await page.$$(elements)).length > 0;
    } catch (err) {
      return false
    }
  }

  static async isElementPresent(locator: string, inx: number): Promise<boolean> {
    return !!(await this.getElement(locator, inx));
  }

  static async clearInput(locator: string): Promise<void> {
    await this.click(locator, true)
    if (process.platform === 'darwin') {
      await page.keyboard.press("Meta")
      await page.keyboard.press("a")
    } else {
      await page.keyboard.press("Control")
      await page.keyboard.press("a")
    }
    await page.keyboard.press("Delete")
  }

  static async getElement(locator: string, inx: number): Promise<ElementHandle<SVGElement | HTMLElement> | void> {
    try {
      const elements = await page.$$(locator);
      // @ts-ignore
      return inx > elements.length ? elements[elements.length] : elements[inx]
    } catch (err: any) {
      await expect(true).toBeFalse(err)
    }
  }

  static async lastElement(locator: string): Promise<any> {
    try {
      const allElements = await page.$$(locator)
      return allElements[allElements.length - 1]
    } catch (err: any) {
      await expect(true).toBeFalse(err)
    }
  }

  static async firstElement(locator: string): Promise<any> {
    return this.getElement(locator, 0)
  }

  static async deleteTokenFromCookies(): Promise<void> {
    await page.evaluate(() => {
      document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    });
    await page.reload({waitUntil: 'domcontentloaded', timeout: 180000});
  }

  static async waitFor(event: Function, timeout = 5000, errorMessage?: string): Promise<boolean> {
    let currentTime = Date.now();
    const endTime = Date.now() + timeout;

    while (currentTime < endTime) {
      if (await event()) return true;
      await page.waitForTimeout(200);
      currentTime = Date.now();
    }

    if (!(await event()) && errorMessage) {
      console.error(errorMessage);
      await this.makeAllureScreenshot()
    }

    return false;
  }

  static async assertElementByState(selector: string, elstate: any, errorMessage?: string,): Promise<void> {
    await expect(selector).toHaveSelector(
      {
        timeout: 5000,
        state: elstate,
      },
      `${errorMessage} ${selector}` || `Error on assertion by selector: ${selector}`,
    );
  }

  static async editCookieValues(
    token: string,
    expiresAt: string,
  ): Promise<void> {
    await page.evaluate(() => {
      document.cookie = `jwt-token=${token}; path=/; expires=${expiresAt};`;
    });
  }

  static async elementsCount(elements: string): Promise<number> {
    try {
      return (await page.$$(elements)).length
    } catch (err) {
      return 0
    }
  }

  static async scrollToBottomOfThePage(): Promise<void> {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  static async getValue(selector: string): Promise<string | null> {
    try {
      return page.evaluate((el: any) => el.value, await page.$(selector))
    } catch (err) {
      return "0"
    }
  }

  static async click(selector: string, withWait?: boolean, timeout?: number): Promise<void> {
    if (withWait) {
      await this.waitForSelector(selector, {timeout})
    }
    try {
      if (await this.elementsCount(selector) > 1) {
        console.info(`Found more then one elements with selector ${selector}, click on the first one`)
        await (await this.firstElement(selector)).click()
      } else {
        await page.click(selector)
      }
    } catch (err) {
      console.error(`Could not click on the element with selector: ${selector} \r\n`, err)
      await expect(false)
        .toBeTrue(`Could not click on the element with selector: ${selector} \r\n ${err ? err : null}`)
    }
  }

  static async clickWithError(selector: string, withWait?: boolean, timeout?: number): Promise<void> {
    if (withWait) {
      await this.waitForSelector(selector, {timeout})
    }
    try {
      if (await this.elementsCount(selector) > 1) {
        await (await this.firstElement(selector)).click()
      }
    } catch (err) {
      console.error(`Could not click on the element with selector: ${selector}`, err)
    }
  }

  static async clickByIndex(selector: string, inx: number, withWait?: boolean, timeout?: number): Promise<void> {
    if (withWait) {
      await this.waitForElements(selector, timeout)
    }
    try {
      const element = await this.getElement(selector, inx)
      if (element) {
        await element.click()
      } else {
        await clickOnElementsError(selector, inx)
      }
    } catch (err: any) {
      await clickOnElementsError(selector, inx, err)
    }
  }

  static async clickOnFirstElement(selector: string, withWait?: boolean, timeout?: number): Promise<void> {
    await this.clickByIndex(selector, 0, withWait, timeout);
  }

  static async clickOnLastElement(selector: string, withWait?: boolean, timeout?: number): Promise<void> {
    if (withWait) await this.waitForElements(selector, timeout)
    const inx = await this.elementsCount(selector) - 1
    try {
      await (await this.lastElement(selector)).click()
    } catch (err: any) {
      await clickOnElementsError(selector, inx, err)
    }
  }

  static async waitForSelector(
    selector: string,
    options: {
      visible?: boolean;
      hidden?: boolean;
      timeout?: number;
    } = {timeout: 5000},
    errorMessage?: string,
  ): Promise<boolean> {
    try {
      await page.waitForSelector(selector, options)
      return true
    } catch (error) {
      await this.makeAllureScreenshot()
      console.error(errorMessage || `Element ${selector} is not appeared after ${options.timeout}ms. \r\n ${errorMessage}`)
      return false
    }
  }

  static async waitForSelectorNotToBeDisabled(selector: string, timeout = 5000) {
    await this.waitFor(
      async () => !(await this.isPresent(selector)),
      timeout,
      `Элемент ${selector} не пропал из DOM'а спустя ${timeout / 1000}с.`
    )
  }

  static async waitForElements(selector: string, timeout?: number) {
    const waitTimeout = timeout || 5000
    await this.waitFor(async () => await this.elementsCount(selector) > 0, waitTimeout)
  }

  static async mouseMove(element: Promise<ElementHandle<SVGElement | HTMLElement> | null>) {
    const boundingBox = await (await element)?.boundingBox()
    if (boundingBox) {
      await page.mouse.move(boundingBox.x, boundingBox.y)
    }
  }

  static async moveMouseByCoords(options: MouseWheelOptions) {
    await page.mouse.wheel(options)
  }

  static async innerText(selector: string, {withWait = false, timeout = 5000}: WithWait = {}) {
    if (withWait) {
      await this.waitForSelector(selector, {timeout})
    }
    try {
      const myElement = await page.$(selector)
      return page.evaluate(element => element.textContent, myElement)
    } catch (e) {
      await this.makeAllureScreenshot()
      console.log(`Could not get elements text by selector ${selector}`)
      return ''
    }
  }

  static async type(selector: string, text: string, {withWait = false, timeout = 5000}: WithWait = {}) {
    if (withWait) {
      await this.waitForSelector(selector, {timeout})
    }
    try {
      await page.type(selector, text)
    } catch (e) {
      await this.makeAllureScreenshot()
      console.log(`Не удалось ввести текст в инпут с локатором ${selector}`)
    }
  }

  static async getAttribute(selector: string, attribute: string, {
    withWait = false,
    timeout = 5000
  }: WithWait = {}): Promise<string | null> {
    if (withWait) {
      await this.waitForSelector(selector, {timeout})
    }
    try {
      const myElement = await page.$(selector)
      return page.evaluate(element => element.getAttribute, myElement)
    } catch (e) {
      await this.makeAllureScreenshot();
      console.log(`Не удалось получить аттрибут ${attribute} элемента ${selector}`);
      return null;
    }
  }
}

const clickOnElementsError = async (selector: string, inx: number, err?: Error) => {
  console.error(`Could not click by ${inx} element with selector ${selector} \r\n`, err)
  await expect(false)
    .toBeTrue(`Could not click by ${inx} element with selector ${selector} \r\n ${err ? err : null}`)
}
