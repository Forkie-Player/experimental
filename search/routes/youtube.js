const express = require("express");
const router = express.Router();

const ytsr = require("ytsr");

router.get("/", async (req, res) => {
   const search = req.query.search;

   const searchResult = await ytsr(
      "https://www.youtube.com/results?search_query=" +
         search +
         "&sp=EgIQAQ%253D%253D",
      { pages: 2, gl: "KR", hl: "ko" }
   );
   res.send(searchResult);

   return res;
});

module.exports = router;
