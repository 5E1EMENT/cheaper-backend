import 'dotenv/config'
import express from 'express'
import bodyParser from 'bodyParser'
import cors from 'cors'
import getScrapedData from './scraper.js'
const app = express()
const port = 3000
const hostname = '0.0.0.0'
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self' *.ozone.ru *.ozonusercontent.com  http://localhost:3000 *.ozon.ru *.kz.ozon.com *.ozon.by *.ozon.kz *.ozonru.me *.by-stg.ozonru.me *.kz-stg.ozoncom.me enterprise.api-maps.yandex.ru wss:");
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
  next();
});
app.post('/api/scraped-data', async (request, response) => {
    const searchProduct = request.body.searchProduct
    console.log('request.body', request.body)
    console.log('searchProduct', searchProduct)
    const parsedData = await getScrapedData(searchProduct)
    

    response.json({
      data: parsedData
    });
});

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`)
})