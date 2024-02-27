import {scrapeOzon} from '../scrapers/scrapeOzon.js';
import {scrapeWildberries} from '../scrapers/scrapeWildberries.js';
import {scrapeSatu} from '../scrapers/scrapeSatu.js';



export const getProductsData = async (pages, searchProduct) => {
    const scraperFunctions = {
      
      'wildberries.ru': scrapeWildberries,
      'satu.kz': scrapeSatu,
      // Добавьте другие функции скрапинга, если необходимо
    };
  
    const scraperPromises = pages.map(async (page) => {
      console.log('page.origin', page.origin);
      const scraperFunction = scraperFunctions[page.origin];
      if (!scraperFunction) {
        throw new Error(`Unsupported origin: ${page.origin}`);
      }
      return scraperFunction(page.page, searchProduct);
    });
  
    const results = await Promise.all(scraperPromises);
    const flattenedResults = [].concat(...results);
  
    return flattenedResults;
  };