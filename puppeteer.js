import puppeteer from 'puppeteer'

export default async function startBrowser(){
	let browser;
	try {
	    console.log("Opening the browser......");
	    browser = await puppeteer.launch({
			executablePath: '/usr/bin/google-chrome',
			args: ['--no-sandbox', '--disable-setuid-sandbox'],
			headless: true
		  });
	} catch (err) {
	    console.log("Could not create a browser instance => : ", err);
	}
	return browser;
}
