const {
  getTopics,
  getApi,
  getArticleByID,
  getArticles,
  getCommentsByArticle,
  patchArticle,
  postComment,
  deleteComment,
} = require("./controllers/news.controller");
const {
  noValidEndpoint,
  uncaughtError,
  customError,
  psqlError,
} = require("./error-handling");
const express = require("express");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticle);

app.patch("/api/articles/:article_id", patchArticle);
app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*", noValidEndpoint);
app.use(psqlError);
app.use(customError);
app.use(uncaughtError);

module.exports = app;
