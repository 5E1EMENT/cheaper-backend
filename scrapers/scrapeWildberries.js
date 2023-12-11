export const scrapeWildberries = async (page, searchProduct) => {
    try {
        await page.waitForSelector('div[data-tag="catalogPanel"]');
        return await page.evaluate(async (searchProduct) => {

            const elements = await fetch(`https://search.wb.ru/exactmatch/ru/common/v4/search?query=${encodeURIComponent(searchProduct)}&resultset=catalog&limit=100&sort=popular&page=1&appType=128&curr=kzt&lang=ru&dest=-1257786&spp=27`).then(res => res.json()).then(data => {
                console.log(data.data)
                return data.data?.products
            })
            console.log('elements', elements)
            return elements.map(item => ({
                price: item.salePriceU / 100,
                link: `https://www.wildberries.ru/catalog/${item.id}/detail.aspx`,
                img: document.querySelector(`img[alt="${item.name} ${item.brand}"]`)?.src,
                name: item.name
            })).sort((a, b) => a.price - b.price).slice(0, 10);
        }, searchProduct);

    } catch (error) {
        console.error('Error scraping Wildberries:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
};

