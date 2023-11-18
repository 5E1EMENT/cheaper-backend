import express from 'express'
import getScrapedData from './scraper.js'
const app = express()
const port = 3000
const hostname = '0.0.0.0'
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.post('/api/scraped-data', async (request, response) => {
    const url = new URL(request.body.url)
    const searchProduct = request.body.searchProduct
    const parsedData = await getScrapedData(searchProduct, url.origin)
    response.json({
      data: parsedData
    });
});

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`)
})
