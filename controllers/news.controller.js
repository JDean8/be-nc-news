const {
  fetchTopics,
  fetchArticleByID,
  fetchArticles,
  fetchCommentsByArticle,
  updateArticle,
  createComment,
  fetchCommentByID,
  fetchUsers,
  removeComment,
  fetchUserByUsername,
  updateComment,
  createPost,
  createTopic,
  removeArticle,
} = require("../models/news.model");
const {
  invalidTopic,
  invalidOrder,
  invalidSortBy,
} = require("../utils/query_checks.utils");
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
  const { topic, sort_by, order, limit, page } = req.query;
  Promise.all([
    fetchArticles(topic, sort_by, order, limit, page),
    fetchArticles(topic, sort_by, order, "ALL"),
    topic && invalidTopic(topic),
    sort_by && invalidSortBy(sort_by),
    order && invalidOrder(order),
  ])
    .then((results) => {
      const articles = results[0].rows;
      const count = results[1].rows.length;
      res.status(200).send({ articles, count });
    })
    .catch((err) => next(err));
};

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { limit, page } = req.query;
  Promise.all([
    fetchCommentsByArticle(article_id, limit, page),
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

  if (!inc_votes) {
    next({
      status: 400,
      msg: "request must include inc_votes",
    });
  } else {
    fetchArticleByID(article_id)
      .then((article) => {
        return updateArticle(article_id, article.votes, inc_votes);
      })
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch((err) => next(err));
  }
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

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  if (!inc_votes) {
    next({
      status: 400,
      msg: "request must include inc_votes",
    });
  } else {
    fetchCommentByID(comment_id)
      .then((comment) => {
        return updateComment(comment_id, comment.votes, inc_votes);
      })
      .then((comment) => {
        res.status(200).send({ comment });
      })
      .catch((err) => next(err));
  }
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then((user) => res.status(200).send({ user }))
    .catch((err) => next(err));
};

exports.postArticle = (req, res, next) => {
  const defaultURL =
    "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700";
  const { author, title, body, topic, article_img_url = defaultURL } = req.body;

  Promise.all([
    createPost(author, title, body, topic, article_img_url),
    invalidTopic(topic),
    fetchUserByUsername(author),
  ])
    .then(([newArticle]) => {
      return fetchArticleByID(newArticle.article_id).then((article) => {
        res.status(201).send({ article });
      });
    })
    .catch((err) => next(err));
};

exports.postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  createTopic(slug, description)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch((err) => next(err));
};

exports.deleteArticle = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    fetchCommentsByArticle(article_id, "ALL"),
    fetchArticleByID(article_id),
  ])
    .then(([{ rows }]) => {
      let promises = [];
      const commentsToBeRemoved = rows;
      commentsToBeRemoved.forEach((comment) => {
        promises.push(removeComment(comment.comment_id));
      });
      return Promise.all(promises);
    })
    .then(() => {
      return removeArticle(article_id);
    })
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => next(err));
};
