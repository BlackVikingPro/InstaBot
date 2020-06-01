import ppt from "puppeteer";

export function delay(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}

export async function extract(handle: ppt.ElementHandle) {
  if (!handle) return;
  return await handle.evaluate((el) => el.innerHTML, handle);
}

export function usernameToUser(username: string): User {
  return {
    url: `https://www.instagram.com/${username}/`,
    username: username,
  };
}

function last<T>(a: Array<T>): T {
  return a[a.length - 1];
}

export function urlToUser(url: string): User {
  const username = last(url.split("/").filter((s) => s.length > 0));
  return usernameToUser(username);
}

export function urlToPost(url: string): Post {
  return {
    url,
  };
}
export type Post = {
  url: string;
};

export type User = {
  url: string;
  username: string;
};
