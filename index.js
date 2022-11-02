const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('http://cardapio.ufv.br/');
  //await page.pdf({ path: 'hn.pdf', format: 'a4' });

  //await browser.close();
})();
