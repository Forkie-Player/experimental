const express = require("express");
const router = express.Router();
const { default: axios } = require("axios");
const { parseViews, parseDuration, parseDate } = require("../utils/parseData");

const url = "https://api.dailymotion.com";
router.get("/", async (req, res) => {
   const search = req.query.search;
   try {
      const result = await axios.get(
         `${url}/videos?search=${encodeURI(
            search
         )}&language=ko&flags=no_premium,exportable,no_live&country=kr&limit=20`
      );

      let searchResult = [];
      const promises = result.data.list.map(async (item) => {
         return new Promise((resolve) => {
            axios
               .get(
                  `${url}/video/${item.id}?fields=id,title,created_time,duration,thumbnail_240_url,views_total,description,channel,owner.screenname,owner.avatar_80_url`
               )
               .then((res) => {
                  searchResult.push({
                     videoId: res.data.id,
                     title: res.data.title,
                     thumbnail: res.data.thumbnail_240_url,
                     channelTitle: res.data["owner.screenname"],
                     channelImage: res.data["owner.avatar_80_url"],
                     duration: parseDuration(res.data.duration),
                     views: parseViews(res.data.views_total),
                     uploadedAt: parseDate(
                        new Date(res.data.created_time * 1000)
                     ),
                     platform: "dailymotion",
                  });
                  resolve();
               })
               .catch(() => {
                  resolve();
               });
         });
      });

      await Promise.all(promises);
      res.send(searchResult);
   } catch (e) {
      res.status(500).send({ message: "dailymotion search error" });
   }
});

module.exports = router;
