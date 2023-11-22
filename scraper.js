import startBrowser from './puppeteer.js'
import { getCurrentUrl } from './functions/getCurrentUrl.js'
import { getArrayOfProducts } from './functions/getArrayOfProducts.js'


export default async function getScrapedData(searchProduct, origin) {
  let browser
  try {
    browser = await startBrowser();

    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
    const url = getCurrentUrl(searchProduct, origin)

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    page.on('console', msg => console.log('CONSOLE LOG:', msg.text()));
    const arrOfProducts = await getArrayOfProducts(origin, page, searchProduct)


    return arrOfProducts
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  } finally {
    // await browser.close()
  }

}
