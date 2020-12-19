# Newegg Bot

Autonomously buy Products such as RTX 3080 from Newegg as soon as they become available

This bot is very much still in the early stages, and more than a little rough around the edges. Expect the occasional hiccups if you decide to use it.

## Installation

1. You will need [Node.js 14](https://nodejs.org/en/) installed to run this.
2. Download this repository (via git or [this zip file](https://github.com/nperez0111/NeweggBot/archive/master.zip)).
3. Run the command `npm install` in the directory where this project is on your computer
4. Copy `config_template.json` to `config.json`
   - Make changes as discussed below
5. Run `npm start` to run the script which will open a chrome window

## Configuration

Once that is finished, create a copy of config_template.json and name it config.json. Inside you will find the very basic customization options.

- `cv2` refers to the three digit code on the back of your credit card.
- `refresh_time` refers to the duration to wait in seconds between add-to-cart attempts.
- `item_number` refers to Newegg's item number found at the end of the card page URL. For example, the item number for 'https://www.newegg.com/evga-geforce-rtx-3080-10g-p5-3897-kr/p/N82E16814487518' is N82E16814487518. This bot can attempt to multiple products. Example, 'item_number':'N82E16814137597,N82E16814487518'. The bot will purchase the first one it finds in stock.
- `auto_submit` refers to whether or not you want the bot to complete the checkout process. Setting it to 'true' will result in the bot completing the purchase, while 'false' will result in it completing all the steps up to but not including finalizing the purchase. It is mostly intended as a means to test that the bot is working without actually having it buy something.
- `price_limit` refers to the maximum price that the bot will attempt to purchase a card for. It is based on the combined subtotal of your cart. However, this version of the bot does not check this variable so do not bother setting a price. You should be sure you have the right product number and understand the price.

## Usage

After installation and configuration, the bot can then be run by using `npm start`.

It is important if you've never used your Newegg account before that you setup your account with a valid address and payment information, and then run through the checkout process manually making any changes to shipping and payment as Newegg requests. You don't need to complete that purchase, just correct things so that when you click `Secure Checkout` from the cart, it brings you to `Review`, not `Shipping` or `Payment`.

At the moment, in the event that a card comes in stock, but goes out of stock before the bot has been able to complete the purchase, it will likely break, and you will need to restart it. In general, there are very likely to be occasional issues that break the bot and require you to restart it.

## Support

If you are having issues using this, message me. I was able to get an RTX 3070 with this code.
