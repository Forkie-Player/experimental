const express = require("express");
const router = express.Router();

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

router.get("/", async (req, res) => {
   try {
      const search = req.query.search;

      // 브라우저를 실행한다.
      // 옵션으로 headless모드를 끌 수 있다.
      const browser = await puppeteer.launch({
         headless: true,
      });

      // 새로운 페이지를 연다.
      const page = await browser.newPage();
      // 페이지의 크기를 설정한다.
      await page.setViewport({
         width: 1920,
         height: 1080,
      });

      // "https://www.twitch.tv/search?term=%EC%B9%A8%EC%B0%A9%EB%A7%A8&type=videos" URL에 접속한다.
      await page.goto(
         `https://www.twitch.tv/search?term=${search}&type=videos`
      );
      await page.waitForNetworkIdle();

      /*
   // 한번 스크롤해서 데이터 더 가져오기
   await page.evaluate(() => {
      const scrollElement = document.querySelector(
         ".root-scrollable > div:nth-child(3)"
      );
      scrollElement.scrollTo(0, scrollElement.scrollHeight);
   });
   await page.waitForNetworkIdle();
   */

      // 페이지의 HTML을 가져온다.
      const content = await page.content();
      // $에 cheerio를 로드한다.
      const $ = cheerio.load(content);

      // 복사한 리스트의 Selector로 리스트를 모두 가져온다.
      // search-results 아래로 2번째 일때도 있고, 4번째 일때도 있음. 화면이 작을떄 2번째에 나타남.
      const lists = $(
         ".search-results > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)"
      );

      // 모든 리스트를 순환한다.
      let parsedData = [];
      lists.children().each((index, list) => {
         const thumbnail = $(list)
            .find("div > div > a > div > img")
            .attr("src");

         const detailes = $(list).find("div > div > div > div > div");
         const title = $(detailes).find("div:nth-child(1) > strong > a").text();
         const idString = $(detailes)
            .find("div:nth-child(1) > strong > a")
            .attr("href");
         if (idString === undefined) {
            return;
         }
         const videoId = new String(idString).split("/").at(-1);

         const channelTitle = $(detailes).find("div:nth-child(2) > p").text();

         const category = $(detailes).find("p:nth-child(3) > a").text();

         let views, uploadedAt;
         if (category.length === 0) {
            views = $(detailes)
               .find("span:nth-child(3)")
               .text()
               .slice(0, -4)
               .trim();
            uploadedAt = $(detailes).find("span:nth-child(5)").text();
         } else {
            views = $(detailes)
               .find("span:nth-child(4)")
               .text()
               .slice(0, -4)
               .trim();
            uploadedAt = $(detailes).find("span:nth-child(6)").text();
         }

         const duration = $(list)
            .find("div > div > a > div > div > div")
            .text();

         parsedData.push({
            videoId,
            title,
            thumbnail,
            channelTitle,
            channelImage: "",
            duration,
            views,
            uploadedAt,
            platform: "twitch",
         });
      });

      // 브라우저를 종료한다.
      browser.close();

      res.send(parsedData);
   } catch (e) {
      res.status(500).send({ message: "twitch search error" });
   }
});

module.exports = router;
