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

    constructor() {
        super()
        this.#initialize()
    }

    async #initialize() {
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
                if (data.access_token) {
                    this.bearer = data.access_token
                    console.log(this.bearer)
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
              'Authorization': 'Bearer eyJjdHkiOiJqd3QiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.ZM1BSvtkxeEx7i3A8uv0_H0dA4Adcu-uPBkFBif2tSzxpkAvGKHq6LhhetPVJsaMyUpp32olZ9inQpODE2bao5ks5KETm4HxquPVyOfSmCuiw_flktZ9GXT13JLusXRKZ4UN3TzNcbOJ3iVWSJxGry6Wn7pHtC2KRrowY4xrR-fM8t3UVjxxfDIp-eI_ySAouQc9m1aDoKvP66d3t0otI5pBZ4vgeCnP24h6_2ad3EqmfQHZuBopsejC8zt0Zk_9PHzt1Lq5hKBNOji7BvLgGzI-iJIDsjLlrh1Gx3FHjXSvqq3YKqy8ViCIQN8Y8IcMRi6-9rHy5NL2w7XADHxxgw.LJrD_YCC6DTT36S92U3sfA.I6PJKmqUXBiCj3LwnvMz3WZHn069Dh5z8IARQ5t1zZtdmN38J6fFTbkzV-R2TmnW9cw786EvyZEDYU_hJtuUymTrgPK4yAJJVIUFJJVZN9X9Xi7VVJ0Vb9NPetuLW1jxZc68N7gKkFCb_9vkS9CR-oecOynPTJ3oqjD-5b87y4609ff9_wZST-OuNobF9Oqmdk48BbD0DGuNCBa1uZz0xJM8Zg786MC-KyFgtdDG4fDzO0vsk5E_iRgNDzkSGqaSPLX17mTraP9-IIEdhfG1YJZH520XntHHHKas7mKZzhhotao3PqTBcyRChq6Me0HGCM1c3Jd4YWsReZcLWW95oiTJzvHRuSDAX7sbhkJ3LgsZ6CIx9X4jTAoyUNjHQr9TCyVND-GIUhkIQMDjt0tbRDelZs-rcO8iiPMnyuXBagDOFAfj1G30bIVAyh4nf6MhzPVvG9qs7v5C_NyXwQepuk3FEJ5Us-azNsXsEou7zIWa4q7F8xJlfExlwNiIf3Hn5nelrDMWCtosADegUAW6aOFlBH0IdwSpRfo2BwjEhAzdSE8xtJ3geBtMJ1R7jjqELoDhGHCfjP-yEjKbKNjdygMwLPMiJBBM-sFfA77Q5H2X2oXN8KjQWyItr645xUHO1n_vNcRLaBSFHerh-2BwYzurMG-FDGYLNTit48C8ub-ASJrLUGSzSndVAfCjXgoBTlDVy3bI7iJdI0kz8qF68iaYTIBecuwh0h9q2VHydsE.6c7PS13ikoaP6xVPKCiKhJauoeZh_D9oZ47B22C4F0U'
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
            return axios(this.#getDefaultConfig(`Мне нужно найти товар, похожий на ${productName}. Вот список товаров: ${JSON.stringify(productsData)}. Возьми имя товара по полю name и верни товары которые похожи на ${productName}? Ответ верни в формате JSON: {"products": products}`))
                .then((response) => {
                    console.log(1111, response.data.choices[0].message.content);
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