import {scrapeOzon} from '../scrapers/scrapeOzon.js';
import {scrapeWildberries} from '../scrapers/scrapeWildberries.js';
import {scrapeSatu} from '../scrapers/scrapeSatu.js';



export const getProductsData = async (pages, searchProduct) => {
    let result = []
    const functions = [];
    // Вызываем все функции скрапинга параллельно
    for (let page of pages) {
        console.log('page.origin', page.origin)
        if (page.origin === 'ozon.kz') {
            functions.push(scrapeOzon(page.page))
        } else if (page.origin === 'wildberries.ru') {
            functions.push(scrapeWildberries(page.page, searchProduct))
        } else if (page.origin === 'satu.kz') {
            functions.push(scrapeSatu(page.page))
        }
    };

        const [satuResult, wildberriesResult, ozonResult] = await Promise.all(functions);

        result.push(...ozonResult, ...wildberriesResult, ...satuResult)

        return result;
}