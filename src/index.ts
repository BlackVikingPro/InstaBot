import ppt from "puppeteer";
import { login } from "./Actions";
import { crawlByHashtagLikers, crawlByHashtag } from "./Campaigns";
import { username, password, hashtag } from "./Secret";

async function start() {
  const browser = await ppt.launch({
    //    headless: false,
  });

  await login(username, password, browser);

  await crawlByHashtag(hashtag, browser);

  await browser.close();
  return;
}

start();
