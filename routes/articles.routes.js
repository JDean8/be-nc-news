const express = require("express");
const router = express.Router();
const {
  getCommentsByArticle,
  getArticleByID,
  getArticles,
  patchArticle,
  postComment,
} = require("../controllers/news.controller");

router.get("/", getArticles);

router.route("/:article_id").get(getArticleByID).patch(patchArticle);

router
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postComment);

module.exports = router;
