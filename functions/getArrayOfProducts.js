const scrollPage = async (selector, page) => {
    const elements = await page.$$(selector);

    for (const element of elements) {
        await element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
        await page.waitForTimeout(430); // Подождем после каждого скролла
    }
};


export const getArrayOfProducts = async (origin, page) => {

    switch (!!origin) {
        case origin.includes('ozon'):
            await page.waitForSelector('body');
            await scrollPage('.c3118-a1', page)
            let items = []
           
            items = await page.$$eval('.widget-search-result-container', (element) => {
                return element.map(item => ({
                    price: item.querySelector('.c3118-a1').textContent.trim(),
                    link: item.querySelector('a').href,
                    img: item.querySelector('img').src
                }))
            })
            return items

            // return await page.evaluate((page) => {
            //     const elements = [...page.querySelector('.widget-search-result-container').children[0].children]
            //     console.log('elements', elements)
            //     return elements.map(item => ({
            //         price: item.querySelector('.c3118-a1').textContent.trim(),
            //         link: item.querySelector('a').href,
            //         img: item.querySelector('img').src
            //     }))
            // })
        case origin.includes('wildberries'):
            // await page.waitForSelector('.catalog-page');
            return await page.evaluate(() => {
                const elements = [...document.querySelectorAll('.product-card ')]
                return elements.map(item => ({
                    price: item.querySelector('.price__lower-price').textContent.trim(),
                    link: item.querySelector('a').href,
                    img: item.querySelector('img').src
                }))
            })
        case origin.includes('satu'):
            // await page.waitForSelector('.MafxA');
            return await page.evaluate(() => {
                const elements = [...document.querySelectorAll('.l-GwW.js-productad')]
                return elements.map(item => ({
                    price: item.querySelector('span.yzKb6').textContent.trim(),
                    link: item.querySelector('a').href,
                    img: item.querySelector('img').src
                }))
            })

    }
}