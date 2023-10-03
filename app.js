const {
  getTopics,
  getApi,
  getArticleByID,
  getArticles,
  getCommentsByArticle,
  postComment,
  deleteComment,
  getUsers,
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
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*", noValidEndpoint);
app.use(psqlError);
app.use(customError);
app.use(uncaughtError);

module.exports = app;
