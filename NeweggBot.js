const puppeteer = require('puppeteer')
const config = require('./config.json')

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function report (log) {
	currentTime = new Date();
	console.log(currentTime.toString().split('G')[0] + ': ' + log)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function run () {

	await report("Started")

	const browser = await puppeteer.launch({
        	headless: false,
			product: 'chrome',
        	defaultViewport: { width: 1366, height: 768 }
		})
		
    const page = await browser.newPage()
	
    while (true) {

		await page.goto('https://secure.newegg.com/NewMyAccount/AccountLogin.aspx?nextpage=https%3a%2f%2fwww.newegg.com%2f' , {waitUntil: 'load' })

		if (page.url().includes('signin')) {

			await page.waitForSelector('button.btn.btn-orange')
			await page.type('#labeled-input-signEmail', config.email)
			await page.click('button.btn.btn-orange')
			await page.waitForTimeout(1500)

			try {
				await page.waitForSelector('#labeled-input-signEmail', {timeout: 500})
			} 
			catch (err) {
				try {
					await page.waitForSelector('#labeled-input-password' , {timeout: 2500})
					await page.waitForSelector('button.btn.btn-orange')
					await page.type('#labeled-input-password', config.password)
					await page.click('button.btn.btn-orange')
					await page.waitForTimeout(1500)

					try {
						await page.waitForSelector('#labeled-input-password', {timeout: 500})
					} 
					catch (err) {
						break
					}
				} 
				catch (err) {
					report("Manual authorization code required by Newegg.  This should only happen once.")
					while (page.url().includes('signin')) {
						await page.waitForTimeout(500)
					}
					break
				}
			}
		} 

		else if (page.url().includes("areyouahuman")) {
			await page.waitForTimeout(1000)
		}
	}

	await report("Logged in")
	await report("Checking for card")

	while (true)
	{

		try {

			if (!(page.url().includes("ShoppingItem"))) { // incase of loop, still only add 1 to cart
				await page.goto('https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=' + config.item_number, { waitUntil: 'load' })
			}

			else if (page.url().includes("ShoppingItem")) { // item is in cart

				await page.goto('https://secure.newegg.com/Shopping/ShoppingCart.aspx', { waitUntil: 'load' })

				try {
					await page.waitForSelector('[class="button button-primary has-icon-right"]', {timeout: 500})
					await page.click('[class="button button-primary has-icon-right"]')
					break
				} 
				catch (err) {}

				try {
					await page.waitForSelector('[class="button button-primary button-override has-icon-right"]', {timeout: 500})
					await page.click('[class="button button-primary button-override has-icon-right"]')
					break
				} 
				catch (err) {}
				
				try {
					await page.waitForSelector('[class="btn btn-primary btn-wide"]', {timeout: 500})
					await page.click('[class="btn btn-primary btn-wide"]')
					break
				} 
				catch (err) {}
			} 

			else if (page.url().includes("areyouahuman")) {
				await page.waitForTimeout(1000)
			}
		} 
		catch (err) {
			continue
		}
	}

	await page.waitForTimeout(1500)

	// CONTINUE TO PAYMENT
	while(true) {
		try {
			await page.waitForSelector('#app > div > section > div > div > form > div.row-inner > div.row-body > div > div:nth-child(2) > div > div.checkout-step-action > button', {timeout: 500})
			await page.click('#app > div > section > div > div > form > div.row-inner > div.row-body > div > div:nth-child(2) > div > div.checkout-step-action > button')
			break
		} catch (err) {
		}
	
		try {
			await page.waitForSelector('#orderSummaryPanelAndPayment > div > div.additional-info-groupbox > div > div > a', {timeout: 500})
			await page.click('#orderSummaryPanelAndPayment > div > div.additional-info-groupbox > div > div > a')
			break
		} catch (err) {
		}
	}

	await page.waitForTimeout(1500)

	// ENTER CVV
	while (true) {

		try {
			await page.waitForSelector('#cvv2Code' , {timeout: 500})
			await page.type('#cvv2Code', config.cv2)
			break
		} 
		catch (err) {}

		try {
			await page.waitForSelector('#creditCardCVV2' , {timeout: 500})
			await page.type('#creditCardCVV2', config.cv2)
			break
		} 
		catch (err) {}

		try {
			await page.waitForSelector('#app > div > section > div > div > form > div.row-inner > div.row-body > div > div:nth-child(3) > div > div.checkout-step-body > div > div.checkout-tabs-wrap.margin-top > div.checkout-tab-content.is-active > div.item-cells-wrap.border-cells.tile-cells.three-cells.expulsion-one-cell.checkout-card-cells > div:nth-child(1) > div > label > div.retype-security-code > input' , {timeout: 500})
			await page.type('#app > div > section > div > div > form > div.row-inner > div.row-body > div > div:nth-child(3) > div > div.checkout-step-body > div > div.checkout-tabs-wrap.margin-top > div.checkout-tab-content.is-active > div.item-cells-wrap.border-cells.tile-cells.three-cells.expulsion-one-cell.checkout-card-cells > div:nth-child(1) > div > label > div.retype-security-code > input', config.cv2)
			break
		} 
		catch (err) {}
	}

	await page.waitForTimeout(1500)

	// CONBTINUE TO ORDER REVIEW
	while (true) {

		try {
			await page.waitForSelector('#btnCreditCard > a' , {timeout: 5000})	
			await page.click('#btnCreditCard > a')
			break
		} catch (err) {}

		try {
			await page.waitForSelector('#app > div > section > div > div > form > div.row-inner > div.row-body > div > div:nth-child(3) > div > div.checkout-step-action > button' , {timeout: 5000})	
			await page.click('#app > div > section > div > div > form > div.row-inner > div.row-body > div > div:nth-child(3) > div > div.checkout-step-action > button')
			break
		} catch (err) {}
	}

	await page.waitForTimeout(1500)

	// PLACE ORDER
	while (config.auto_submit) {

		try {
			await page.waitForSelector('#btnCreditCard' , {timeout: 5000})	
			await page.click('#btnCreditCard')
			break
		} catch (err) {}

		try {
			await page.waitForSelector('#SubmitOrder' , {timeout: 5000})	
			await page.click('#SubmitOrder')
			break
		} catch (err) {}

		try { // incase of UPS suggested billing address
			await page.waitForSelector('#BillingForm > div > div.recommend > a' , {timeout: 5000})	
			await page.click('#BillingForm > div > div.recommend > a')
			break
		} catch (err) {}
	}

	await report("Completed purchase")
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

run()
