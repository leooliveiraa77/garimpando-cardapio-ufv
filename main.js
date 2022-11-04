//const puppeteer = require('puppeteer');
//const fs = require('fs');
import puppeteer from 'puppeteer';
import * as fs from 'fs';

const date = new Date();
const weekDay = date.getDay();
const day = date.getDate();
const numberToSunday = 6 - weekDay;

const scrapingData = [];
let weekDayName;

(async () => {
  const browser = await puppeteer.launch({ headless: true }); // { headless: false }
  const page = await browser.newPage();
  //await page.setViewport({ width: 1920, height: 1080 });
  await page.goto('http://cardapio.ufv.br/', {
    waitUntil: 'domcontentloaded',
    timeout: 0,
  });

  await page.waitForSelector('.titulo_composicao');

  for (let i = day - 1; i <= day + numberToSunday; i++) {
    let weekDayHandler = i + 1;

    switch (weekDayHandler) {
      case 0:
        weekDayName = 'Segunda';
        break;
      case 1:
        weekDayName = 'Terça';
        break;
      case 2:
        weekDayName = 'Quarta';
        break;
      case 3:
        weekDayName = 'Quinta';
        break;
      case 4:
        weekDayName = 'Sexta';
        break;
      case 5:
        weekDayName = 'Sábado';
        break;
      case 6:
        weekDayName = 'Domingo';
        break;
    }
    const dayButtons = await page.$$('a.ui-state-default');
    await dayButtons[i].click();
    await page.waitForSelector('.titulo_composicao');
    console.log(i + 1);

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

    scrapingData.push(weekDayMenu);
  }

  fs.writeFile('menu-week.json', JSON.stringify(scrapingData, null, 2), (err) => {
    if (err) throw new Error('something went wrong');
    console.log('Well done!');
  });
  await browser.close();
})();
