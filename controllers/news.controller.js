const {
  fetchTopics,
  fetchArticleByID,
  fetchArticles,
  fetchCommentsByArticle,
  createComment,
  fetchCommentByID,
  removeComment,
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
    .then((article) => {
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

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  Promise.all([
    fetchCommentsByArticle(article_id),
    fetchArticleByID(article_id),
  ])
    .then(([{ rows }]) => {
      res.status(200).send({ comments: rows });
    })
    .catch((err) => {
      next(err);
    });
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
    .catch((err) => next(err));
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  fetchCommentByID(comment_id)
    .then(() => {
      return removeComment(comment_id);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => next(err));
};
