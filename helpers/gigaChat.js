import fetch from 'node-fetch'
import https from 'https'
import axios from 'axios'

import { ChatBot } from './ChatBot.js';

const url = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';
const authorizationHeader = `Basic ${process.env.GIGA_CHAT_AUTH_TOKEN}`;
const rqUIDHeader = '9791b31e-7f48-477d-8ae4-87114c7e418f';
const contentTypeHeader = 'application/x-www-form-urlencoded';
const scopeData = 'GIGACHAT_API_PERS';

const agent = new https.Agent({
    rejectUnauthorized: false,
})


const requestBody = new URLSearchParams();
requestBody.append('scope', scopeData);

export class GigaChat extends ChatBot {
    bearer = null
    expiresAt = null

    constructor() {
        super()
        this.#initialize()
    }

    async #initialize() {
        if (this.expiresAt && new Date(this.expiresAt) > new Date()) {
            return;
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': authorizationHeader,
                'RqUID': rqUIDHeader,
                'Content-Type': contentTypeHeader,
            },
            body: requestBody.toString(),
            agent: agent
        })
            .then(response => response.json())
            .then(data => {
                console.log('data', data)
                if (data.access_token) {
                    this.bearer = data.access_token
                    this.expiresAt = data.expires_at
                } else {
                    throw new Error('Ошибка', data)
                }
            })
            .catch(error => console.error('Error:', error));
    }

    #getDefaultData = (prompt) => {
        return JSON.stringify({
            "model": "GigaChat",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 1,
            "top_p": 0.1,
            "n": 1,
            "stream": false,
            "max_tokens": 1024,
            "repetition_penalty": 1,
            "update_interval": 0
        });
    }

    #getDefaultConfig = (prompt) => { 
        return  {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
            headers: { 
              'Content-Type': 'application/json', 
              'Accept': 'application/json', 
              'Authorization': `Bearer ${this.bearer}`
            },
            httpsAgent: agent,
            data: this.#getDefaultData(prompt)
          }
    }

    async getUnifiedProductName(productName) {
        try {
            const config = this.#getDefaultConfig(`Выдели главное в названии товара, убери тип товара оставь только основные признаки товара: ${productName}. Ответ в формате JSON {"productName": productName}.  Для меня очень важно, чтобы ты все время возвращал только в таком формате`)
            return axios(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    return JSON.parse(response.data.choices[0].message.content).productName
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (e) {
            console.error('Error getting unified product name (getUnifiedProductName) :', e);
            throw e
        }

    }
    async getSimilarProductStrings(productsData, productName) {
        try {
            return axios(this.#getDefaultConfig(`Мне нужно найти товар, похожий на ${productName}. Вот список товаров: ${JSON.stringify(productsData)}. Оставь в этом списке товаров только товары которые являются ${productName}? Ответ верни в формате JSON: {"products": products}`))
                .then((response) => {
                    return JSON.parse(response.data.choices[0].message.content).products
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (e) {
            console.error('Error getting unified product name (getUnifiedProductName) :', e);
            throw e
        }
    }
}