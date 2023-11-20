import startBrowser from './puppeteer.js'
import { getCurrentUrl } from './functions/getCurrentUrl.js'
import { getArrayOfProducts } from './functions/getArrayOfProducts.js'


export default async function getScrapedData(searchProduct, origin) {

  try {
    const browser = await startBrowser()
    const page = await browser.newPage();
    console.log('origin1', origin)
    const url = getCurrentUrl(searchProduct, origin)

    console.log('url', url)

    await page.goto(url, { waitUntil: 'load' })


    const arrOfProducts = await getArrayOfProducts(origin, page)
   
    await browser.close()

    return arrOfProducts
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }

}
