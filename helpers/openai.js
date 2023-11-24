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
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Выдели главное в названии товара, убери тип товара оставь только основные признаки товара: ${productName}. Ответ в формате JSON: productName` }],
            temperature: 0,
            max_tokens: 1000,
        }).then(data => JSON.parse(data.choices[0].message.content)?.productName)
    } catch (e) {
        console.error('Error getting unified product name (getUnifiedProductName) :', e);
        return ''; // Возвращаем пустоую строку
    }

}

export const getBestProduct = async (productName) => {
    try {
        return await openApi.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `Выдели главное в названии товара, убери тип товара оставь только основные признаки товара: ${productName}. Ответ в формате JSON: productName` }],
            temperature: 0,
            max_tokens: 1000,
        }).then(data => JSON.parse(data.choices[0].message.content)?.productName)
    } catch (e) {
        console.error('Error getting unified product name (getUnifiedProductName) :', e);
        return ''; // Возвращаем пустоую строку
    }

}