const express = require("express");
const router = express.Router();
const {
  deleteComment,
  patchComment,
} = require("../controllers/news.controller");

router.route("/:comment_id").patch(patchComment).delete(deleteComment);

module.exports = router;
