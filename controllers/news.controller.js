const {
  fetchTopics,
  fetchArticleByID,
  fetchArticles,
} = require("../models/news.model");
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
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No article found with that ID",
        });
      }
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then(({ rows }) => {
      res.status(200).send({ articles: rows });
    })
    .catch((err) => {
      next(err);
    });
};
