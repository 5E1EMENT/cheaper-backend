import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import PuppeteerDevtools  from 'puppeteer-extra-plugin-devtools'
const devtools = PuppeteerDevtools()
puppeteer.use(StealthPlugin())
puppeteer.use(devtools)

export default async function startBrowser(prod) {
	try {
		console.log("Opening the browser......");
		const options = {
			args: [
				'--no-sandbox',
				'--disable-dev-shm-usage',
				'--disable-gpu',
				'--disable-setuid-sandbox',
				'--no-zygote',
				// Другие параметры, если необходимо
			  ],
			headless: 'new',
			dumpio: true,
			// Уровень логирования для Chromium
			logLevel: 'verbose',
		}

		if(prod === 'true') {
			options.executablePath = '/usr/bin/google-chrome'
		}
		const browser = await puppeteer.launch(options);
		
		return browser;
	} catch (err) {
		console.log("Could not create a browser instance => : ", err);
	}

}
