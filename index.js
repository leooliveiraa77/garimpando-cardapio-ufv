const puppeteer = require('puppeteer');
const fs = require('fs');

const date = new Date();
const weekDay = date.getDay();
const day = date.getDate();
const numberToSunday = 6 - weekDay;

(async () => {
  const browser = await puppeteer.launch({ headless: true }); // { headless: false }
  const page = await browser.newPage();
  //await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://cardapio.ufv.br/', {
    waitUntil: 'domcontentloaded',
    timeout: 0,
  });

  await page.waitForSelector('.titulo_composicao');
  const scrapingData = [];

  for (let i = day - 1; i <= day + numberToSunday; i++) {
    const dayButtons = await page.$$('a.ui-state-default');
    await dayButtons[i].click();
    await page.waitForSelector('.titulo_composicao');

    const result = await page.$$eval('.titulo_composicao i', (menuDay) => menuDay.map((el) => el.innerText));

    const weekDayMenu = {
      lunchMain: result[8],
      lunchGarrison: result[11],
      dinnerMain: result[18],
      dinnerGarrison: result[21],
    };

    if (result[14] === 'Laranja' || result[14] === 'Maracujá') {
      weekDayMenu['juice'] = result[14];
    }
    console.log(weekDayMenu);
    scrapingData.push(weekDayMenu);
  }

  fs.writeFile('meu-week.json', JSON.stringify(scrapingData, null, 2), (err) => {
    if (err) throw new Error('something went wrong');
    console.log('Well done!');
  });
  await browser.close();
})();
