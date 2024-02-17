import 'dotenv/config'
import express from 'express'
import getScrapedData from './scraper.js'

const app = express()
const port = 3000
const hostname = '0.0.0.0'
app.use(express.json());
app.use(express.urlencoded({extended:true}));


const parsedData = await getScrapedData('Iphone 15 Pro max')


app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`)
})