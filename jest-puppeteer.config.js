module.exports = {
  launch: {
    dumpio: true,
    timeout: 30000,
    headless: process.env.HEADLESS !== 'false',
    product: 'chrome',
    devtools: false,
    args: ['--start-maximized'],
    verbose: true
  },
  browserContext: 'default',
}
