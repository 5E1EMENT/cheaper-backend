
export const getArrayOfProducts = async (origin, page, searchProduct) => {

    switch (!!origin) {
        case origin.includes('ozon'):
            await page.waitForSelector('.widget-search-result-container')

            return await page.evaluate(() => {
                const elements = [...document.querySelectorAll('.ix9.x9i')]
                return elements.map(item => ({
                    price: Number(item.children[1].children[0].children[0].children[0].textContent.trim().replace(/\D/g,'')),
                    link: item.querySelector('a').href,
                    img: item.querySelector('img').src
                })).sort((a, b) => a.price - b.price)
            })
        case origin.includes('wildberries'):
            await page.waitForSelector('.catalog-page');

            return await page.evaluate(async (searchProduct) => {
                const elements = await fetch(`https://search.wb.ru/exactmatch/ru/common/v4/search?query=${encodeURIComponent(searchProduct)}&resultset=catalog&limit=100&sort=popular&page=1&appType=128&curr=kzt&lang=ru&dest=-1257786&spp=0`).then(res => res.json()).then(data => data.data.products)
                return elements.map(item => ({
                    price: item.salePriceU,
                    link: `https://www.wildberries.ru/catalog/${item.id}/detail.aspx`,
                    img: ''
                })).sort((a, b) => a.price - b.price)
            }, searchProduct)

        case origin.includes('satu'):
            await page.waitForSelector('[data-qaid="product_gallery"]');
            return await page.evaluate(() => {
                const elements = [...document.querySelectorAll('.l-GwW.js-productad')]
                console.log('elements', elements)
                return elements.map(item => ({
                    price: item.querySelector('span.yzKb6').textContent.trim(),
                    link: item.querySelector('a').href,
                    img: item.querySelector('img').src
                })).sort((a, b) => a.price - b.price)
            })

    }
}