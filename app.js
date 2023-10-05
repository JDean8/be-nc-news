const {
  getTopics,
  getApi,
  deleteComment,
  getUsers,
} = require("./controllers/news.controller");
const {
  noValidEndpoint,
  uncaughtError,
  customError,
  psqlError,
} = require("./error-handling");
const articleRouter = require("./routes/articles.routes");
const express = require("express");

const app = express();
app.use(express.json());

app.use("/api/articles", articleRouter);

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/users", getUsers);
app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*", noValidEndpoint);
app.use(psqlError);
app.use(customError);
app.use(uncaughtError);

module.exports = app;
