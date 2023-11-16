import express from 'express'
import getScrapedData from './scraper.js'
const app = express()
const port = 3001
const hostname = '0.0.0.0'
app.use(express.json());

app.get('/status', async (request, response) => {
    console.log('request', request.body)
    //https://ozon.kz/category/smartfony-15502/?category_was_predicted=true&deny_category_prediction=true&from_global=true&text=iphone+15+pro+max+256
    //https://www.wildberries.ru/catalog/0/search.aspx?search=iphone%2015%20pro%20max%20256
  const parsedData = await getScrapedData('https://satu.kz/search?search_term=iphone%2015%20pro%20max%20256', 'satu')
  console.log('parsedData',parsedData)
  response.send(parsedData);
});

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`)
})
