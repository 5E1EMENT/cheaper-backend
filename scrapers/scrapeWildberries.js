export const scrapeWildberries = async (page, searchProduct) => {
    try {
        await page.waitForSelector('.catalog-page');
        return await page.evaluate(async (searchProduct) => {

            const elements = await fetch(`https://search.wb.ru/exactmatch/ru/common/v4/search?TestGroup=no_test&TestID=no_test&appType=1&curr=kzt&dest=-1257786&query=${encodeURIComponent(searchProduct)}&resultset=catalog&sort=popular&spp=26&suppressSpellcheck=false`).then(res => res.json()).then(data => {
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

