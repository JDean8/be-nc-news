const { fetchTopics } = require("../models/news.model");
const apiDocs = require("../endpoints.json");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then(({ rows }) => {
      res.status(200).send({ topics: rows });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getApi = (req, res, next) => {
  return res.status(200).send({ endpoints: apiDocs });
};
