const express = require("express");
const router = express.Router();

const ytsr = require("ytsr");
const { parseViews } = require("../utils/parseData");

router.get("/", async (req, res) => {
   try {
      const search = req.query.search;

      const searchResult = await ytsr(
         "https://www.youtube.com/results?search_query=" +
            search +
            "&sp=EgIQAQ%253D%253D",
         { pages: 2, gl: "KR", hl: "ko" }
      );

      const filteredResult = searchResult.items
         .filter((item) => item.type === "video")
         .map((item) => ({
            videoId: item.id,
            title: item.title,
            thumbnail:
               (item.thumbnails && item.thumbnails[0].url) ||
               item.bestThumbnail.url,
            channelTitle: item.author.name,
            channelImage: item.author.bestAvatar.url,
            duration: item.duration,
            views: parseViews(item.views),
            uploadedAt: item.uploadedAt,
            platform: "youtube",
         }));

      res.send(filteredResult);
   } catch (e) {
      res.status(500).send({ message: "youtube search error" });
   }
});

module.exports = router;
