module.exports = {
  preset: 'jest-puppeteer',
  testRunner: 'jest-jasmine2',
  testMatch: ['**/__tests__/**/*.+(ts|js)', '**/?(*.)+(spec|test).+(ts|js)'],
  testTimeout: 15000,
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },
  verbose: true,
  setupFilesAfterEnv: [
    'jest-allure/dist/setup',
    './confs/config.ts',
    './customMatchers.ts',
  ],
};
