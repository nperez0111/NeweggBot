const puppeteer = require('puppeteer');
const { start } = require('repl');
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
			defaultViewport: { width: 1500, height: 768 }
		})
	const page = await browser.newPage()
	await page.setCacheEnabled(false);
	
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
	await report("Checking for Item")

	var safecounter = 0
	const startTime = new Date();
	var nowTime = new Date();
	var timeDiffMinutes = Math.round((nowTime - startTime) / 1000) / 60;
	
	while (true) {

		if (timeDiffMinutes >= 40) {
			await report("OUT OF TIME")
					await browser.close()
					return run();
		}

		if (page.url().includes("areyouahuman")) {
			await page.waitForTimeout(1000)
		}

		try {
			await page.goto('https://secure.newegg.com/Shopping/AddtoCart.aspx?Submit=ADD&ItemList=' + config.item_number, { waitUntil: 'load' })
			await page.waitForTimeout(1000)
			try {
				await page.waitForSelector('#bodyArea > section > div > div > div.message.message-success.message-added > div > div.item-added.fix > div.item-added-info', {timeout: 500})
				break
			} catch(err) {
				try {
					await page.waitForSelector('#app > div.page-content > section > div > div > form > div.row-inner > div.row-body > div > div > div.item-container > div.item-qty > input', {timeout: 500})
					break
				}
				catch(err) {
					try {
						await page.waitForSelector('#bodyArea > div.article > form:nth-child(1) > table.shipping-group.subscription-group > tbody > tr > td:nth-child(3) > div > button:nth-child(2)', {timeout: 500})
						break
					}
					catch(err) {}
				}
			}
		} catch(err) {}

		nowTime = new Date();
		timeDiffMinutes = Math.round((nowTime - startTime) / 1000) / 60;
	}

	await report("Item found")
	await page.waitForTimeout(1000)

	while (true)
	{
		try { // 'REMOVE ITEM(S)'
			await page.waitForSelector('#app > div.page-content > div > div > div > div.modal-footer > button.btn.btn-secondary', {timeout: 500})
			await page.click('#app > div.page-content > div > div > div > div.modal-footer > button.btn.btn-secondary', {timeout: 500})
			await page.waitForTimeout(500)
		} 
		catch (err) {}

		try { // at ShoppingItem url
			await page.waitForSelector('#bodyArea > section > div > div > div.message.message-success.message-added > div > div.item-added.fix > div.item-operate > div > button.btn.btn-primary', {timeout: 500})
			await page.click('#bodyArea > section > div > div > div.message.message-success.message-added > div > div.item-added.fix > div.item-operate > div > button.btn.btn-primary', {timeout: 500})
			await page.waitForTimeout(500)
		} 
		catch (err) {}

		try {
			await page.waitForSelector('[class="btn btn-primary btn-wide"]', {timeout: 500})
			await page.click('[class="btn btn-primary btn-wide"]')
			await page.waitForTimeout(1500)
			try {
				await page.waitForSelector('#app > header > div.header2020-inner > div.header2020-right > div:nth-child(1) > div:nth-child(2) > a', {timeout: 500})
			}
			catch(err) {break}

		} 
		catch (err) {}
		
		try { 
			await page.waitForSelector('#bodyArea > div.article > div.step-navigation > div.actions.l-right > div > a.button.button-primary.has-icon-right', {timeout: 500})
			await page.click('#bodyArea > div.article > div.step-navigation > div.actions.l-right > div > a.button.button-primary.has-icon-right')
			await page.waitForTimeout(1500)
			try {
				await page.waitForSelector('#app > header > div.header2020-inner > div.header2020-right > div:nth-child(1) > div:nth-child(2) > a', {timeout: 500})
			}
			catch(err) {break}
		} 
		catch (err) {}

		try {
			await page.waitForSelector('[class="button button-primary button-override has-icon-right"]', {timeout: 500})
			await page.click('[class="button button-primary button-override has-icon-right"]')
			await page.waitForTimeout(2000)
			try {
				await page.waitForSelector('#app > header > div.header2020-inner > div.header2020-right > div:nth-child(1) > div:nth-child(2) > a', {timeout: 500})
			}
			catch(err) {break}
		} 
		catch (err) {}
	}

	await report("Continued to cart")
	await page.waitForTimeout(1000)

	// CONTINUE TO PAYMENT
	while(true) {

		try {
			await page.waitForSelector('#app > div > section > div > div > form > div.row-inner > div.row-body > div > div:nth-child(2) > div > div.checkout-step-action > button', {timeout: 500})
			await page.click('#app > div > section > div > div > form > div.row-inner > div.row-body > div > div:nth-child(2) > div > div.checkout-step-action > button')
			break
		} catch (err) {}
	
		try {
			await page.waitForSelector('#orderSummaryPanelAndPayment > div > div.additional-info-groupbox > div > div > a', {timeout: 500})
			await page.click('#orderSummaryPanelAndPayment > div > div.additional-info-groupbox > div > div > a')
			break
		} catch (err) {}
	}

	await report("Continued to payment")
	await page.waitForTimeout(1000)

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

	await report("ccv entered")
	await page.waitForTimeout(1000)

	// CONTINUE TO ORDER REVIEW
	while (true) {

		try {
			await page.waitForSelector('#btnCreditCard > a' , {timeout: 500})	
			await page.click('#btnCreditCard > a')
			break
		} catch (err) {}

		try {
			await page.waitForSelector('#app > div > section > div > div > form > div.row-inner > div.row-body > div > div:nth-child(3) > div > div.checkout-step-action > button' , {timeout: 500})	
			await page.click('#app > div > section > div > div > form > div.row-inner > div.row-body > div > div:nth-child(3) > div > div.checkout-step-action > button')
			break
		} catch (err) {}
	}

	await report("Continued to order review")
	await page.waitForTimeout(1000)

	// PLACE ORDER
	while (config.auto_submit == "true") {

		try { // incase of UPS suggested billing address
			await page.waitForSelector('#BillingForm > div > div.recommend > a' , {timeout: 500})	
			await page.click('#BillingForm > div > div.recommend > a', {timeout: 500})
		} catch (err) {}

		try { // incase of you have to 'Accept terms'
			await page.waitForSelector('#term', {timeout: 500})	
			await page.click('#term', {timeout: 500})
		} catch (err) {}

		try {
			await page.waitForSelector('#btnCreditCard' , {timeout: 500})	
			await page.click('#btnCreditCard', {timeout: 500})
			try {
				await page.waitForSelector('#btnCreditCard' , {timeout: 500})	
			} catch(err) {
				break
			}
		} catch (err) {}

		try {
			await page.waitForSelector('#SubmitOrder' , {timeout: 1500})	
			await page.click('#SubmitOrder', {timeout: 500})
			try {
				await page.waitForSelector('#SubmitOrder' , {timeout: 1500})	
			} catch(err) {
				break
			}
		} catch (err) {}
	}

	await report("Completed purchase")
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

run();