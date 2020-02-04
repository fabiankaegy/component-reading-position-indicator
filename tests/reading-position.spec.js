import puppeteer from 'puppeteer';

const APP = 'https://fabiankaegy.github.io/component-reading-position-indicator/demo/test-demo.html';
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

	test( 'calls callbacks', async () => {

		const showBox = jest.fn();
		const hideBox = jest.fn();
		const onCreate = jest.fn();
		const updatePercentage = jest.fn();

		// Visit the page in headless Chrome
		await page.goto( APP );

		await page.waitFor( '#scrollEnd', { visible: true } );

		await page.evaluate( () => {
			// initiates the reading position indicator
			let myReadingPosition = new TenUp.readingPosition( '.reading-position', {
				onCreate: onCreate,
				scrollStart: showBox,
				scrolling: updatePercentage,
				scrollEnd: hideBox,
				startElement: '#scrollStart',
				endElement: '#scrollEnd',
			} );
		} );

		expect( onCreate ).toHaveBeenCalledTimes(1);

	} )

} );

afterAll( () => {
	browser.close();
} );
