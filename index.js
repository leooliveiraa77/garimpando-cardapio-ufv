const puppeteer = require('puppeteer');

const date = new Date();
const weekDay = date.getDay();
const day = date.getDate();
const numberToSunday = 6 - weekDay;

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // { headless: false }
  const page = await browser.newPage();
  await page.goto('http://cardapio.ufv.br/', {
    waitUntil: 'networkidle2',
    timeout: 0,
  });

  await page.waitForTimeout(5000);

  for (let i = day - 1; i <= day + numberToSunday; i++) {
    const dayButtons = await page.$$('a.ui-state-default');
    await dayButtons[i].click();
    await page.waitForTimeout(1000);
  }

  await browser.close();
})();
