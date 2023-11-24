export const scrapeWildberries = async (page, searchProduct) => {
    try {
        await page.waitForSelector('.catalog-page');

        return await page.evaluate(async (searchProduct) => {
            const elements = await fetch(`https://search.wb.ru/exactmatch/ru/common/v4/search?query=${encodeURIComponent(searchProduct)}&resultset=catalog&limit=100&sort=popular&page=1&appType=128&curr=kzt&lang=ru&dest=-1257786&spp=0`).then(res => res.json()).then(data => data.data.products);
            return elements.map(item => ({
                price: item.salePriceU,
                link: `https://www.wildberries.ru/catalog/${item.id}/detail.aspx`,
                img: ''
            })).sort((a, b) => a.price - b.price);
        }, searchProduct);

    } catch (error) {
        console.error('Error scraping Wildberries:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
};

