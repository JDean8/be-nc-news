const express = require("express");
const router = express.Router();
const { getTopics, postTopic } = require("../controllers/news.controller");

router.route("/").get(getTopics).post(postTopic);

module.exports = router;
