import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';
import { readFile } from 'fs/promises';
dotenv.config({ path: './.env' });

const jsonData = JSON.parse(await readFile(new URL('./menu-week.json', import.meta.url)));

const notion = new Client({ auth: process.env.NOTION_KEY });

//Função para pegar a estrutura e id's do database
//(Caso tenha duvidas, verifica a documentação do notion API)

// (async () => {
//   const databaseId = process.env.NOTION_DATABASE_ID;
//   const response = await notion.databases.retrieve({ database_id: databaseId });
//   console.log(response);
// })();

let classificar = 0;

async function createMenu(menuObj) {
  notion.pages.create({
    parent: {
      database_id: process.env.NOTION_DATABASE_ID,
    },
    properties: {
      title: {
        title: [
          {
            type: 'text',
            text: {
              content: menuObj.weekDay,
            },
          },
        ],
      },
      [process.env.NOTION_PAGE_ALMOCO]: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: `${menuObj.lunchMain} (${menuObj.lunchGarrison})`,
            },
          },
        ],
      },
      [process.env.NOTION_PAGE_JANTAR]: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: `${menuObj.dinnerMain} (${menuObj.dinnerGarrison})`,
            },
          },
        ],
      },
      [process.env.NOTION_PAGE_SUCO]: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: menuObj.juice ? menuObj.juice : '',
            },
          },
        ],
      },
      [process.env.NOTION_PAGE_CLASSIDICAR]: {
        number: classificar,
      },
    },
  });
}

async function sendDataToNotion() {
  for (const el of jsonData) {
    await createMenu(el);
    classificar++;
  }
}
sendDataToNotion();
