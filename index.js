import express from 'express'
import getScrapedData from './scraper.js'
const app = express()
const port = 3000
const hostname = '0.0.0.0'
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const parsedData = await getScrapedData('Iphone 15 max', 'https://wildberries.ru')

console.log(parsedData)

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`)
})

//docker build -t daniilnikitas/cheaper-backend:0.0.1.RELEASE .
//docker container run -d -p 3000:3000 daniilnikitas/cheaper-backend:0.0.1.RELEASE