export const scrapeSatu = async (page) => {
    try {
        await page.waitForSelector('[data-qaid="product_gallery"]');
        return await page.evaluate(() => {
            const elements = [...document.querySelectorAll('.l-GwW.js-productad')];
            console.log(elements)
            return elements.map(item => ({
                price: Number(item.querySelector('span.yzKb6').textContent.trim().replace(/\D/g, '')),
                link: item.querySelector('a').href,
                img: item.querySelector('img').src,
                name: item.querySelector('a').getAttribute('title')
            })).sort((a, b) => a.price - b.price).slice(0,10);
        });
    } catch (error) {
        console.error('Error scraping Satu:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
};