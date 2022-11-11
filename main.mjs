import puppeteer from 'puppeteer';
import * as fs from 'fs';

const date = new Date();
const weekDay = date.getDay();
const day = date.getDate();
const numberToSunday = 6 - weekDay;

export const scrapingData = [];
let weekDayName;
let nextWeekDay = 0;

export const scrapingHandler = async () => {
  const browser = await puppeteer.launch(); // { headless: false }
  const page = await browser.newPage();
  //await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://cardapio.ufv.br/', {
    waitUntil: 'domcontentloaded',
    timeout: 0,
  });

  await page.waitForSelector('.titulo_composicao');

  for (let i = day - 1; i <= day + numberToSunday; i++) {
    let weekDayHandler = weekDay + nextWeekDay;

    switch (weekDayHandler) {
      case 1:
        weekDayName = 'Segunda';
        break;
      case 2:
        weekDayName = 'Terça';
        break;
      case 3:
        weekDayName = 'Quarta';
        break;
      case 4:
        weekDayName = 'Quinta';
        break;
      case 5:
        weekDayName = 'Sexta';
        break;
      case 6:
        weekDayName = 'Sábado';
        break;
      case 0 || 7:
        weekDayName = 'Domingo';
        break;
    }
    const dayButtons = await page.$$('a.ui-state-default');
    await dayButtons[i].click();
    await page.waitForSelector('.titulo_composicao');

    const result = await page.$$eval('.titulo_composicao i', (menuDay) => menuDay.map((el) => el.innerText));

    const weekDayMenu = {
      weekDay: weekDayName,
      lunchMain: result[8],
      lunchGarrison: result[11],
      dinnerMain: result[18],
      dinnerGarrison: result[21],
    };

    if (result[14] === 'Uva' || result[14] === 'Maracujá') {
      weekDayMenu['juice'] = result[14];
    }
    nextWeekDay++;
    scrapingData.push(weekDayMenu);
  }

  fs.writeFile('menu-week.json', JSON.stringify(scrapingData, null, 2), (err) => {
    if (err) throw new Error('something went wrong');
    console.log('Well done!');
  });
  await browser.close();
};
