const express = require("express");
const router = express.Router();
const {
  getCommentsByArticle,
  getArticleByID,
  getArticles,
  patchArticle,
  postComment,
  postArticle,
  deleteArticle,
} = require("../controllers/news.controller");

router.route("/").get(getArticles).post(postArticle);

router
  .route("/:article_id")
  .get(getArticleByID)
  .patch(patchArticle)
  .delete(deleteArticle);

router
  .route("/:article_id/comments")
  .get(getCommentsByArticle)
  .post(postComment);

module.exports = router;
