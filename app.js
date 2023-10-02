const { getTopics } = require("./controllers/news.controller");
const { noValidEndpoint, uncaughtError } = require("./error-handling");
const express = require("express");

const app = express();

app.get("/api/topics", getTopics);

app.all("/*", noValidEndpoint);

app.use(uncaughtError);

module.exports = app;
