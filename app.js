const {
  getTopics,
  getApi,
  getArticleByID,
} = require("./controllers/news.controller");
const { noValidEndpoint, uncaughtError } = require("./error-handling");
const express = require("express");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getApi);
app.get("/api/articles/:article_id", getArticleByID);

app.all("/*", noValidEndpoint);

app.use(uncaughtError);

module.exports = app;
