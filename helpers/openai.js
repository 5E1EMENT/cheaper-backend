import OpenAI from 'openai';

const openApi = new OpenAI({
    apiKey: 'sk-5EeW6hRLmP2i2Sui668cCb35Bc46471b98F6645c544aB762',
    dangerouslyAllowBrowser: true,
    baseURL: 'https://neuroapi.host/v1',
    defaultHeaders: {
        'Access-Control-Allow-Origin': '*',
    }
});


export const getUnifiedProductName = async (productName) => {
    try {
        return await openApi.chat.completions.create({
            model: "gpt-4",// пробуем гпт 4
            messages: [{ role: "user", content: `Выдели главное в названии товара, убери тип товара оставь только основные признаки товара: ${productName}. Ответ в формате JSON {productName: productName}` }],
            temperature: 0,
            max_tokens: 1000,
        }).then(data => {
            return JSON.parse(data.choices[0].message.content)?.productName
        })
    } catch (e) {
        console.error('Error getting unified product name (getUnifiedProductName) :', e);
        return ''; // Возвращаем пустоую строку
    }

}

export const getSimilarProductStrings = async (productsData, productName) => {
    try {
        console.log('productsData', productsData.length)
        return await openApi.chat.completions.create({
            model: "gpt-4", // пробуем гпт 4
            messages: [{ role: "user", content: `Мне нужно найти товар, похожий на ${productName}. Вот список товаров: ${JSON.stringify(productsData)}. Возьми имя товара по полю name и верни товары которые похожи на ${productName}? Ответ верни в формате JSON: {products: products}` }],
            temperature: 0,
            max_tokens: 1000,
          }).then(data => {
                try {
                    return JSON.parse(JSON.parse(JSON.stringify(data.choices[0].message.content))).products
                } catch (err) {
                    console.error('data.choices[0].message.content', data.choices[0].message.content)
                } 
          } )   
    } catch (e) {
        console.error('Error getting similar products strings (getSimilarProductStrings) :', e);
        return {products: []}; // Возвращаем пустоую строку
    }

}