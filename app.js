const {
  articleRouter,
  usersRouter,
  commentsRouter,
  topicsRouter,
} = require("./routes");
const express = require("express");
const { getApi } = require("./controllers/news.controller");
const {
  noValidEndpoint,
  uncaughtError,
  customError,
  psqlError,
} = require("./error-handling");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// routers
app.use("/api/articles", articleRouter);
app.use("/api/users", usersRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/topics", topicsRouter);

// endpoints
app.get("/api", getApi);

// error handling
app.all("/*", noValidEndpoint);
app.use(psqlError);
app.use(customError);
app.use(uncaughtError);

module.exports = app;
