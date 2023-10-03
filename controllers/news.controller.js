const {
  fetchTopics,
  fetchArticleByID,
  fetchArticles,
  fetchCommentsByArticle,
  updateArticle,
  createComment,
} = require("../models/news.model");
const apiDocs = require("../endpoints.json");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then(({ rows }) => {
      res.status(200).send({ topics: rows });
    })
    .catch((err) => next(err));
};

exports.getApi = (req, res, next) => {
  return res.status(200).send({ endpoints: apiDocs });
};

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then(({ rows }) => {
      res.status(200).send({ articles: rows });
    })
    .catch((err) => next(err));
};

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    fetchCommentsByArticle(article_id),
    fetchArticleByID(article_id),
  ])
    .then(([{ rows }]) => {
      res.status(200).send({ comments: rows });
    })
    .catch((err) => next(err));
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  let validityCheck = 1;
  if (!inc_votes) {
    validityCheck = Promise.reject({
      status: 400,
      msg: "request must include inc_votes",
    });
  }

  Promise.all([fetchArticleByID(article_id), validityCheck])
    .then(([article]) => {
      return updateArticle(article_id, article.votes, inc_votes);
    })
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => next(err));
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  Promise.all([
    createComment(article_id, username, body),
    fetchArticleByID(article_id),
  ])
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
