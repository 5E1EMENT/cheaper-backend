import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import getScrapedData from './scraper.js'
const app = express()
const port = process.env.PORT || 4000
const hostname = '0.0.0.0'
app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self' *.ozone.ru *.ozonusercontent.com  http://localhost:3000 *.ozon.ru *.kz.ozon.com *.ozon.by *.ozon.kz *.ozonru.me *.by-stg.ozonru.me *.kz-stg.ozoncom.me enterprise.api-maps.yandex.ru wss:");
  next();
});

app.get('/api/scraped-data', async (request, response) => {
    const searchProduct = request.query.searchProduct
    const parsedData = await getScrapedData(searchProduct)
    

    response.json({
      data: parsedData
    });
});

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`)
})