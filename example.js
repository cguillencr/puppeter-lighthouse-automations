const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
const fs = require('fs');

(async() => {

	// Use Puppeteer to launch headful Chrome and don't use its default 800x600 viewport.
	const browser = await puppeteer.launch({
	  headless: true,
	  defaultViewport: null,
	});

	// Wait for Lighthouse to open url, then inject our stylesheet.
	const page = await browser.newPage();
	await page.setViewport({width: 1200, height: 720})
	await page.goto('<<Login page>>');//Place here your login page
	//await page.waitForNavigation();
	await page.type('<<email field selector>>', '<<email>>');//Place here  the selector for the email field and then a valid value
	await page.type('<<password field selector>>', '<<password>>');//Place here  the selector for the password field and then a valid value
	await page.click('<<button field selector>>');//Place here  the selector for the button to submit the request.

	//await page.screenshot({path: 'pre.png'});
	// Lighthouse will open the URL.
	// Puppeteer will observe `targetchanged` and inject our stylesheet.
	const report  = await lighthouse('<<target page>>', {//Place here the url for the target page
		port: (new URL(browser.wsEndpoint())).port,
		outputPath: './lighthouse-results.html',
		logLevel: 'info',
		onlyCategories: ['performance']
	}).then(results => {
	  return results;
	});
	const html = ReportGenerator.generateReport(report.lhr, 'html');
	const json = ReportGenerator.generateReport(report.lhr, 'json');
	fs.writeFileSync('lhreport.html', html);
	fs.writeFileSync('lhreport.json', json);
	console.log(`Lighthouse scores: ${Object.values(report.lhr.categories).map(c => c.score).join(', ')}`);
	//await page.screenshot({path: 'post.png'});
	await browser.close();
})();