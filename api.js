import express from 'express'
import cors from 'cors'
import getScrapedData from './scraper.js'
const app = express()
const port = 3000
const hostname = '0.0.0.0'
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self' *.ozone.ru *.ozonusercontent.com  http://localhost:3000 *.ozon.ru *.kz.ozon.com *.ozon.by *.ozon.kz *.ozonru.me *.by-stg.ozonru.me *.kz-stg.ozoncom.me enterprise.api-maps.yandex.ru wss:");
  next();
});
app.post('/api/scraped-data', async (request, response) => {
    const url = new URL(request.body.url)
    const searchProduct = request.body.searchProduct
    console.log('searchProduct', searchProduct, 'url.origin', url.origin)
    const parsedData = await getScrapedData(searchProduct, url.origin)
    

    response.json({
      data: parsedData
    });
});

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`)
})