import startBrowser from './puppeteer.js'

const scrollPage = async (selector, page) => {
  const elements = await page.$$(selector);

  for (const element of elements) {
    await element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
    await page.waitForTimeout(430); // Подождем после каждого скролла
  }
};

export default async function getScrapedData(url, shop) {

  try {
    const browser = await startBrowser()
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load' })


    let arrOfProducts = []


    if (shop === 'ozon') {
      await page.waitForSelector('#paginatorContent');
      await scrollPage('.c3118-a1', page)

      arrOfProducts = await page.evaluate(() => {
        const elements = [...document.querySelectorAll('.xi8.x8i')]
        return elements.map(item => ({
          price: item.querySelector('.c3118-a1').textContent.trim(),
          link: item.querySelector('a').href,
          img: item.querySelector('img').src
        }))
      })
    } else if(shop === 'wildberries') {
      await page.waitForSelector('.catalog-page');
      arrOfProducts = await page.evaluate(() => {
        const elements = [...document.querySelectorAll('.product-card ')]
        return elements.map(item => ({
          price: item.querySelector('.price__lower-price').textContent.trim(),
          link: item.querySelector('a').href,
          img: item.querySelector('img').src
        }))
      })
    } else if(shop === 'satu') {
      await page.waitForSelector('.MafxA');
      arrOfProducts = await page.evaluate(() => {
        const elements = [...document.querySelectorAll('.l-GwW.js-productad')]
        return elements.map(item => ({
          price: item.querySelector('span.yzKb6').textContent.trim(),
          link: item.querySelector('a').href,
          img: item.querySelector('img').src
        }))
      })
    }

    await browser.close()

    return arrOfProducts
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }

}
