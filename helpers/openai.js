import OpenAI from 'openai';
import { ChatBot } from './ChatBot.js';

export class ChatGPT extends ChatBot {
    openApi = null;

    constructor() {
        super()
        this.openApi = new OpenAI({
            apiKey: process.env.API_KEY,
            dangerouslyAllowBrowser: true,
            baseURL: 'https://neuroapi.host/v1',
            defaultHeaders: {
                'Access-Control-Allow-Origin': '*',
            }
        })
    }

    async getUnifiedProductName(productName) {
        try {
            console.log('getUnifiedProductName111', productName)
            return await this.openApi.chat.completions.create({
                model: "gpt-3.5-turbo",// пробуем гпт 4 /gpt-3.5-turbo
                messages: [{ role: "user", content: `Выдели главное в названии товара, убери тип товара оставь только основные признаки товара: ${productName}. Ответ в формате JSON {productName: productName}.  Для меня очень важно, чтобы ты все время возвращал только в таком формате` }],
                temperature: 0,
                max_tokens: 1000,
            }).then(data => JSON.parse(data.choices[0].message.content)?.productName)
        } catch (e) {
            console.error('Error getting unified product name (getUnifiedProductName) :', e);
            throw e
        }
    
    }

    async getSimilarProductStrings(productsData, productName) {
        try {
            return await this.openApi.chat.completions.create({
                model: "gpt-3.5-turbo", // пробуем гпт 4 / gpt-3.5-turbo
                messages: [{ role: "user", content: `Мне нужно найти товар, похожий на ${productName}. Вот список товаров: ${JSON.stringify(productsData)}. Возьми имя товара по полю name и верни товары которые похожи на ${productName}? Ответ верни в формате JSON: {products: products}` }],
                temperature: 0,
                max_tokens: 2000,
              }).then(data => JSON.parse(JSON.parse(JSON.stringify(data.choices[0].message.content))).products)   
        } catch (e) {
            console.error('Error getting similar products strings (getSimilarProductStrings) :', e);
            throw e
        }
    }
}