import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const notion = new Client({ auth: process.env.NOTION_KEY });

const databaseId = process.env.NOTION_DATABASE_ID;

(async () => {
  const blockId = databaseId;
  const response = await notion.blocks.children.list({
    block_id: blockId,
  });
  console.log(response);
})();
