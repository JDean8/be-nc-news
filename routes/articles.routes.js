const express = require("express");
const router = express.Router();
const {
  getCommentsByArticle,
  getArticleByID,
  getArticles,
  patchArticle,
  postComment,
  postArticle,
} = require("../controllers/news.controller");

router.route("/").get(getArticles).post(postArticle);

router.route("/:article_id").get(getArticleByID).patch(patchArticle);

router
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postComment);

module.exports = router;
