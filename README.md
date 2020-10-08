# NeweggBot
Autonomously buy GPUs from Newegg as soon as they become available

This will likely remain pretty barebones and is only intended for advanced users that can troubleshoot their own issues as needed.

You will require [Node.js 14](https://nodejs.org/en/) to run this.
After installing via git or by downloading the code and extracting it, navigate to the folder where the files are located via powershell(or equivalent console) and run `npm install puppeteer`

Once that is finished, create a copy of config_template.json and name it config.json.  Inside you will find the very basic customization options.  
- 'cv2' refers to the three digit code on the back of your credit card.  
- 'refresh_time' is the duration to wait in seconds between add-to-cart attempts.  
- 'item_number' refers to Newegg's item number found at the end of the card page URL.  For example, the item number for 'https://www.newegg.com/evga-geforce-rtx-3080-10g-p5-3897-kr/p/N82E16814487518' is N82E16814487518.  This bot can attempt to buy multiple card models at once by including multiple item numbers separated by a comma.  For example, 'N82E16814487518,N82E16814137598'.  Be cautious with this however, as there are no checks in place to ensure that only one card is purchased, so if by chance, two cards you're attempting to purchase come in stock at the same time, the bot would attempt to purchase both.    
- 'auto_submit' refers to whether or not you want the bot to complete the checkout process.  Setting it to 'true' will result in the bot completing the purchase, while 'false' will result it in completing all the steps up to but not including finalizing the purchase.  It is mostly intended as a means to test that the bot is working without actually having it buy something. 

At the moment, in the event that a card comes in stock, but goes out of stock before the bot has been able to complete the purchase, it will likely break, and you will need to restart it.  In general, there are very likely to be issues that break the bot and require you to restart it.   