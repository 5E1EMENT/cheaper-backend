import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import PuppeteerDevtools  from 'puppeteer-extra-plugin-devtools'
const devtools = PuppeteerDevtools()
puppeteer.use(StealthPlugin())
puppeteer.use(devtools)

const isApi = process.env.IS_API
const isHeadless = process.env.IS_HEADLESS

export default async function startBrowser() {
	try {
		console.log("Opening the browser......");
		console.log("isHeadless", isHeadless === 'new' ? isHeadless : false);
		const options = {
			args: [
				'--no-sandbox',
				'--disable-dev-shm-usage',
				'--disable-gpu',
				'--disable-setuid-sandbox',
				'--no-zygote',
				// Другие параметры, если необходимо
			  ],
			headless: isHeadless === 'new' ? isHeadless : false,
			dumpio: true,
			// Уровень логирования для Chromium
			logLevel: 'verbose',
		}

		console.log('isApi === true', isApi === 'true')

		if(isApi === 'true') {
			options.executablePath = '/usr/bin/google-chrome'
		}
		const browser = await puppeteer.launch(options);
		
		return browser;
	} catch (err) {
		console.log("Could not create a browser instance => : ", err);
	}

}
