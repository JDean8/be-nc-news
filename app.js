const {
  getTopics,
  getApi,
  deleteComment,
} = require("./controllers/news.controller");
const {
  noValidEndpoint,
  uncaughtError,
  customError,
  psqlError,
} = require("./error-handling");
const { articleRouter, usersRouter } = require("./routes");

const express = require("express");

const app = express();
app.use(express.json());

app.use("/api/articles", articleRouter);
app.use("/api/users", usersRouter);

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*", noValidEndpoint);
app.use(psqlError);
app.use(customError);
app.use(uncaughtError);

module.exports = app;
