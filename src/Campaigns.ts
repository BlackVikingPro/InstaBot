import ppt from "puppeteer";

import {
  getPostsFromHashTag,
  getFollowRatio,
  getLikersFromPost,
  getUserFromPost,
} from "./Retrieve";

import { follow, likeUsersPosts } from "./Actions";
import { delay } from "./Shared";

export async function crawlByHashtag(hashtag: string, browser: ppt.Browser) {
  const posts = await getPostsFromHashTag(hashtag, browser);
  const page = await browser.newPage();
  for (let i = 0; i < posts.length; i++) {
    const user = await getUserFromPost(posts[i], page);
    const ratio = await getFollowRatio(user, page);

    if (ratio >= 0.2 && ratio <= 1.1) {
      console.log(user.username, "suitable");
      await likeUsersPosts(user, page);
      await follow(user, page);
    }
    await delay(2000);
  }
}

export async function crawlByHashtagLikers(
  hashtag: string,
  browser: ppt.Browser
) {
  const posts = await getPostsFromHashTag(hashtag, browser);
  const page = await browser.newPage();
  for (let i = 0; i < posts.length; i++) {
    const users = await getLikersFromPost(posts[i], browser);

    for (let j = 0; j < users.length; j++) {
      const user = users[j];

      const ratio = await getFollowRatio(user, page);

      if (ratio >= 0.2 && ratio <= 1.1) {
        console.log(user, "suitable");
        await likeUsersPosts(user, page);
        await follow(user, page);
      }
      await delay(2000);
    }
  }
}
