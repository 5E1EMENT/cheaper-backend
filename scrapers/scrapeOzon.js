export const scrapeOzon = async (page) => {
    try {
        await page.waitForSelector('.widget-search-result-container');
        await page.waitForTimeout(2000);
        return await page.evaluate(() => {
            const elements = [...document.querySelector('.widget-search-result-container').children[0].children];
            return elements.map(item => ({
                price: Number(item.children[1].children[0].children[0].children[0].textContent.trim().replace(/\D/g, '')),
                link: item.querySelector('a').href,
                img: item.querySelector('img').src
            })).sort((a, b) => a.price - b.price);
        });
    } catch (error) {
        console.error('Error scraping Ozon:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
};
