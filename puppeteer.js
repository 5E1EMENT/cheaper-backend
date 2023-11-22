import puppeteer from 'puppeteer'

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
			headless: false,
			dumpio: true,
			// Уровень логирования для Chromium
			logLevel: 'verbose',
		}

		if(prod) {
			options.executablePath = '/usr/bin/google-chrome'
		}
		const browser = puppeteer.launch(options);
		return browser;
	} catch (err) {
		console.log("Could not create a browser instance => : ", err);
	}

}
