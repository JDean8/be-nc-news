const { fetchTopics, fetchArticleByID } = require("../models/news.model");
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

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticleByID(article_id)
    .then(({ rows }) => {
      const article = rows[0];
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
