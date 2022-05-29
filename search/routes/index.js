const express = require("express");
const router = express.Router();

router.use("/search/twitch", require("./twitch.js"));
router.use("/search/youtube", require("./youtube.js"));
router.use("/search/dailymotion", require("./dailymotion.js"));
router.use("/search/soundcloud", require("./soundcloud.js"));

module.exports = router;
