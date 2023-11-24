import startBrowser from './puppeteer.js'
import { getCurrentUrl } from './functions/getCurrentUrl.js'
import { getProductsData } from './functions/getProductsData.js'
import { ORIGINS } from './helpers/constants.js'
import { getUnifiedProductName } from './helpers/openai.js';


export default async function getScrapedData(searchProduct, origin) {
  let browser
  try {
    browser = await startBrowser(true);
    const unifiedName = await getUnifiedProductName(searchProduct);
    const pages = []
    for (origin of ORIGINS) {
      const page = await browser.newPage();
      const url = getCurrentUrl(searchProduct, origin)
      console.log('url', url)
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      pages.push({
        origin,
        page
      })
      page.on('console', msg => console.log('CONSOLE LOG:', msg.text()));
    }

    console.log('pages', pages)
    const productsData = await getProductsData(pages, unifiedName)
    console.log('productsData', productsData)
    return productsData
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  } finally {
    await browser.close()
  }

}
