const express = require("express");
const router = express.Router();
const { default: axios } = require("axios");

const url = "https://api.dailymotion.com";
router.get("/", async (req, res) => {
   const search = req.query.search;
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
               searchResult.push(res.data);
               resolve();
            })
            .catch(() => {
               resolve();
            });
      });
   });

   await Promise.all(promises);
   res.send(searchResult);
});

module.exports = router;
