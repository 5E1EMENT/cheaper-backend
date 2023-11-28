import startBrowser from './puppeteer.js'
import { getCurrentUrl } from './functions/getCurrentUrl.js'
import { getProductsData } from './functions/getProductsData.js'
import { getSimilarProducts } from './functions/getSimilarProducts.js'
import { fetchDataWithRetry } from './functions/fetchWithRetry.js'
import { ORIGINS } from './helpers/constants.js'
import { getUnifiedProductName, getSimilarProductStrings } from './helpers/openai.js';

export default async function getScrapedData(searchProduct) {
  let browser
  try {
    console.log('process.env.IS_API', process.env.IS_API)
    browser = await startBrowser(process.env.IS_API);
    console.log('start')
    const unifiedName = await fetchDataWithRetry(getUnifiedProductName, searchProduct);
    console.log('unifiedName', unifiedName)
    const pages = []
    for (let origin of ORIGINS) {
      const page = await browser.newPage();
      const url = getCurrentUrl(unifiedName, origin)
      console.log('url', url)
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      pages.push({
        origin,
        page
      })
      page.on('console', msg => console.log('CONSOLE LOG:', msg.text()));
    }

    const productsData = await getProductsData(pages, unifiedName)
    const productNames = productsData.map(item => item.name)
    const similarProductsStrings = await fetchDataWithRetry(getSimilarProductStrings, productNames, searchProduct)
    const similarProductsData = getSimilarProducts(similarProductsStrings, productsData)
    console.log('similarProductsData', similarProductsData)
    return similarProductsData
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  } finally {
    await browser.close()
  }

}
