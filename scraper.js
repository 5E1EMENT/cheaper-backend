import startBrowser from './puppeteer.js'
import { getCurrentUrl } from './functions/getCurrentUrl.js'
import { getProductsData } from './functions/getProductsData.js'
import { getSimilarProducts } from './functions/getSimilarProducts.js'
import { fetchDataWithRetry } from './functions/fetchWithRetry.js'
import { ORIGINS } from './helpers/constants.js'
import { ChatGPT } from './helpers/openai.js';
import { ChatController } from './helpers/ChatController.js';
import { GigaChat } from './helpers/gigaChat.js'


export default async function getScrapedData(searchProduct) {
  let browser
  const isHeadless = process.env.IS_HEADLESS

  try {
    // Пример использования
    const chatGPT = new ChatGPT();
    const gigaChat = new GigaChat();

    const chatController1 = new ChatController(chatGPT);
    const chatController2 = new ChatController(gigaChat);

    console.log('process.env.IS_API', process.env.IS_API)
    browser = await startBrowser();
    console.log('start')
    const unifiedName = await fetchDataWithRetry((searchProduct) => chatController2.getUnifiedProductName(searchProduct), searchProduct);
    console.log('unifiedName', unifiedName)
    const pages = []
    const customHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
      'Origin': 'https://global.wildberries.ru',
      'Referer': 'https://global.wildberries.ru',
      // Другие заголовки, если необходимо
    };
    for (let origin of ORIGINS) {
      const page = await browser.newPage();
    
      await page.setExtraHTTPHeaders(customHeaders);

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
    console.log('productNames', productNames)
    const similarProductsStrings = await fetchDataWithRetry((productNames, searchProduct) => chatController2.getSimilarProductStrings(productNames, searchProduct), productNames, searchProduct)
    const similarProductsData = getSimilarProducts(similarProductsStrings, productsData) || []
    console.log('similarProductsData', similarProductsData)
    return similarProductsData
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  } finally {
    isHeadless === 'new' ? await browser.close() : false
  }

}
