const { articleRouter, usersRouter, commentsRouter } = require("./routes");
const express = require("express");
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

const app = express();
app.use(express.json());

// routers
app.use("/api/articles", articleRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);

// endpoints
app.get("/api", getApi);
app.get("/api/topics", getTopics);

// error handling
app.all("/*", noValidEndpoint);
app.use(psqlError);
app.use(customError);
app.use(uncaughtError);

module.exports = app;
