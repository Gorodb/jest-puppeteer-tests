import {config} from 'dotenv';
import AdminApi from "./api/requests/adminMethods";

config();

(async () => {
  // дефолтные таймауты
  page.setDefaultTimeout(15000)
  page.setDefaultNavigationTimeout(60000)

  // пермишны для контекста, чтобы проходили тесты копирования
  try {
    const context = await page.context()
    await context.grantPermissions([
      'clipboard-read',
      'clipboard-write',
      'notifications',
      'background-sync',
      'accessibility-events',
      'payment-handler'
    ])
  } catch (err) {
    console.warn(`В данном браузере нельзя задавать пермишны`)
  }
})()
