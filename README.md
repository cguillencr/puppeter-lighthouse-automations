# puppeter-lighthouse-automations
The following example use https://pptr.dev/ a Node.js framework for browser automation and https://github.com/GoogleChrome/lighthouse a performance tool for browser testing.

Please install the following packages to make the automation works
```
npm install -g lighthouse
npm install -g yarn
yarn add --dev lighthouse
npm i puppeteer-core
npm i puppeteer
```
To make it work on a remote ubuntu please install chromium browser for headless testing
```
apt-get update
apt-get install chromium-browser
```
The following script will open a browser, then authenticate an user in the log-in and finally open a new tab for the target page and run lighthouse to scan it.
Step 1 - Open the login page
```
const browser = await puppeteer.launch({
  headless: true, // false for remote ubuntu
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
```
After a successful login 
Step 2 - Open a new tab for lighthouse 
```
const report  = await lighthouse('<<target page>>', {//Place here the url for the target page
	port: (new URL(browser.wsEndpoint())).port,
	outputPath: './lighthouse-results.html',
	logLevel: 'info',
	onlyCategories: ['performance']
}).then(results => {
  return results;
});
```
Step 3 - Then save the result 
```
const html = ReportGenerator.generateReport(report.lhr, 'html');
const json = ReportGenerator.generateReport(report.lhr, 'json');
fs.writeFileSync('lhreport.html', html);
fs.writeFileSync('lhreport.json', json);
```
Save the result of the performance scanning in a couple of files for a further analysis.

Use the following command to execute the script on windows or linux as well.
```
node  --trace-warnings example.js
```