import puppeteer from 'puppeteer';

const APP = 'https://fabiankaegy.github.io/component-reading-position-indicator/demo/demo-2.html';
const width = 1440;
const height = 860;

let page;
let browser;

beforeAll( async () => {

	browser = await puppeteer.launch( {
		headless: true,
	} );

	page = await browser.newPage();

	await page.setViewport( {
		width,
		height
	} );

} );

describe( 'General Tests', () => {

	test( 'starts with percentage of 0', async () => {

		// Visit the page in headless Chrome
		await page.goto( APP );

		const progressElement = await page.$('progress');
		const percentageHandle = await progressElement.getProperty( 'value' );
		const percentage = await percentageHandle.jsonValue();

		expect( percentage ).toBe( 0 );

	} );

	test( 'updates the percentage when scrolled', async () => {

		// Visit the page in headless Chrome
		await page.goto( APP );


		// scroll all the way to the bottom
		await page.evaluate(() => {
			window.scrollBy( 0, document.body.scrollHeight )
		})

		await page.waitFor('#scrollEnd', {visible: true});

		const progressElement = await page.$('progress');
		const percentageHandle = await progressElement.getProperty( 'value' );
		const percentage = await percentageHandle.jsonValue();

		expect( percentage ).toBe( 100 );

	} );

} );

afterAll( () => {
	browser.close();
} );
