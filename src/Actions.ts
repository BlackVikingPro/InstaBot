import ppt from "puppeteer";
import { extract, delay, User } from "./Shared";

export async function login(
  username: string,
  password: string,
  browser: ppt.Browser
) {
  const page = await browser.newPage();

  await page.goto("https://www.instagram.com/accounts/login/");
  await page.waitForSelector("input[name=username]");

  await page.type("input[name=username]", username, {
    delay: 20,
  });

  await page.type("input[name=password]", password, {
    delay: 20,
  });

  await page.click("button[type=submit]");
  await delay(3000);

  return;
}

export async function likeUsersPosts(user: User, page: ppt.Page) {
  const url = user.url;

  if (page.url() != url) {
    await page.goto(url);
  }

  let postUrls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("a"))
      .map((a) => a.href)
      .filter((url) => url.startsWith("https://www.instagram.com/p/"))
      .filter((_, i) => i <= 2);
  });

  for (const url of postUrls) {
    await page.goto(url);
    if (Math.random() >= 0.25) {
      await likePost(url, page);
    }
    await delay(3000 * Math.random());
  }
}

export async function likePost(url: string, page: ppt.Page) {
  if (page.url() != url) {
    await page.goto(url);
  }

  const likeButton = await page.$("svg[aria-label=Like]");
  if (likeButton) {
    await likeButton.click();
  }
}

export async function follow(user: User, page: ppt.Page) {
  const url = user.url;

  if (page.url() != url) {
    await page.goto(url);
  }
  await delay(1000);
  const buttons = await page.$$("button");
  const theButton = buttons.filter(async (b) => {
    return (await extract(b)) == "Follow";
  })[0];

  await theButton.click();

  await delay(1500);
  return;
}
