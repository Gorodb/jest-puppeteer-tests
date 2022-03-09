import {config} from 'dotenv';

import {envPath} from "./envPath";
import AdminApi from "../api/requests/contactsMethods";

config({ path: envPath });

(async () => {
  // default timeouts
  page.setDefaultTimeout(15000)
  page.setDefaultNavigationTimeout(15000)

  // clear db before tests
  await AdminApi.clearDb()

  // permissions for context
  try {
    const context = await browser.defaultBrowserContext()
    if (process.env.SITE_URL) {
      await context.overridePermissions(process.env.SITE_URL, ['geolocation'])
    }
  } catch (err) {
    console.warn(`Could not set permissions`)
  }
})()
