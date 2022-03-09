class SoftAssertion {
  constructor() {
    this.isFail = false;
    this.errors = [];
  }
  private isFail: boolean;
  private errors: string[];

  expect(actual: any) {
    const toBeTrue = (errorMessage: string) => {
      if (!actual) {
        this.setFail(errorMessage)
      }
    }

    const toBeFalse = (errorMessage: string) => {
      if (actual) {
        this.setFail(errorMessage)
      }
    }

    const toEqual = (expected: any, errorMessage: string) => {
      if (actual !== expected) {
        this.setFail(errorMessage)
      }
    }

    const notToEqual = (expected: any, errorMessage: string) => {
      if (actual === expected) {
        this.setFail(errorMessage)
      }
    }

    const toContainText = (expected: string, errorMessage: string) => {
      if (!actual.includes(expected)) {
        this.setFail(errorMessage)
      }
    }

    const toBeGreater = (expected: number, errorMessage: string) => {
      if (actual < expected) {
        this.setFail(errorMessage)
      }
    }

    return {
      toBeTrue,
      toBeFalse,
      toEqual,
      notToEqual,
      toContainText,
      toBeGreater
    }
  }

  async assertAll() {
    if (this.isFail) {
      console.error(this.errors.join('\r\n'))
    }
    await expect(this.isFail).toBeFalse(this.errors.join('\r\n'))
  }

  private setFail(errorMessage: string) {
    this.isFail = true;
    this.errors.push(`✘ ${errorMessage}`);
  }

  private setSuccess(errorMessage: string) {
    this.errors.push(`✔ ${errorMessage}`);
  }
}

export default SoftAssertion;
