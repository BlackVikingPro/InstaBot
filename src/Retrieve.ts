import ppt from "puppeteer";
import {
  delay,
  extract,
  Post,
  User,
  usernameToUser,
  urlToUser,
} from "./Shared";

export async function getFollowRatio(user: User, page: ppt.Page) {
  const url = user.url;

  if (page.url() != url) {
    await page.goto(url);
  }
  const meat = await page.evaluate(() => {
    return document.body.innerText
      .split("\n")
      .filter((s) => s.includes("follow"));
  });

  const [followersString, followingString] = meat;

  try {
    const followers: number = parseInt(
      followersString.replace(" followers", "").replace(",", "")
    );
    const following: number = parseInt(
      followingString.replace(" following", "").replace(",", "")
    );

    return followers / following;
  } catch {
    return -1;
  }
}

export async function getUserFromPost(
  post: Post,
  page: ppt.Page
): Promise<User> {
  const url = post.url;
  if (page.url() != url) {
    await page.goto(url);
  }

  const username = await page.evaluate(() => {
    return document.body.innerText.split("\n")[0];
  });

  return usernameToUser(username);
}

async function scroll(page: ppt.Page) {
  return await page.evaluate((_) => {
    window.scrollBy(0, window.innerHeight);
  });
}

export async function getLikersFromPost(
  post: Post,
  browser: ppt.Browser
): Promise<Array<User>> {
  const page = await browser.newPage();
  await page.goto(post.url);
  await delay(1000);
  const buttons = await page.$$("button[type=button]");

  buttons.forEach(async (b) => {
    const title = await extract(b);
    if (title.includes("likes") || title.includes("others")) {
      console.log("Found like button");
      await b.click();
    }
  });

  await page.waitForSelector("div[role=dialog]");
  await delay(500);

  let links = [];

  for (let i = 0; i < 10; i++) {
    console.log("scrolling", i);

    await page.$eval(
      "div[style='height: 356px; overflow: hidden auto;']",
      (dialog) => {
        dialog.scrollBy(0, 150);
      }
    );

    const newLinks = await page.$eval("div[role=dialog]", (dialog) => {
      for (let i = 0; i < 10; i++) {
        dialog.scrollBy(0, 100);
      }

      return Array.from(dialog.querySelectorAll("a")).map((el) => el.href);
    });

    links = [...newLinks, ...links];

    await delay(250);
  }

  let result = [...new Set(links.map(urlToUser))];

  return result;
}

export async function getPostsFromHashTag(
  tag: string,
  browser: ppt.Browser,
  includePopular = false
): Promise<Array<Post>> {
  const page = await browser.newPage();
  await page.goto(`https://www.instagram.com/explore/tags/${tag}/`);
  await delay(1000);
  for (let i = 0; i < 20; i++) {
    await scroll(page);
    await delay(250);
  }
  let posts: Array<Post> = await page.$$eval("a", (allA) => {
    return allA
      .map((a) => a["href"])
      .filter((href: string) => href.startsWith("https://www.instagram.com/p/"))
      .map((url) => {
        return { url };
      });
  });

  if (!includePopular) {
    posts = posts.filter((_, i) => i >= 9); // filter out first 9
  }

  return posts;
}
