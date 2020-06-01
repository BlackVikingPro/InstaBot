# InstaBot

Automate your instagram brand expansion strategy with this open source tool powered by puppeteer and headless Google Chrome. Automatically follow suitable users.

# Features

- Crawl by hashtag
- Like users posts
- Calculate a users followers/following ratio

# Getting Started

- Create `src/secret.ts` and populate it with

  ```ts
  export const username = "YourUsernameHere";
  export const password = "YourPasswordHere";
  export const hashtag = "gardening"; // Or any other tag
  ```

  These credentials will only be sent to instagram

- Install parcel with `yarn global add parcel` or `npm i -g parcel`
- Install dependencies with `yarn install` or `npm install`
- Run `yarn build` or `npm run build`
- Run `node dist` to start following suitable users on `#gardening`
