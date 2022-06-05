const express = require("express");
const router = express.Router();
const { default: axios } = require("axios");

const url = "https://api.dailymotion.com";
router.get("/", async (req, res) => {
   const search = req.query.search;
   try {
      const result = await axios.get(
         "https://api.soundcloud.com/tracks?q=hello&ids=1,2,3&genres=Pop,House&access=playable&limit=3&linked_partitioning=true"
      );
      res.send(result.data);
   } catch (e) {
      res.status(500).send("soundcloud search error");
   }
});

module.exports = router;
