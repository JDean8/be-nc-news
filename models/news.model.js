db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`);
};

exports.fetchArticleByID = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1
    `,
      [article_id]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No article found with that ID",
        });
      }
      return article;
    });
};

exports.fetchArticles = () => {
  return db.query(`
    
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id)::INT AS comment_count FROM articles
    LEFT JOIN comments on comments.article_id = articles.article_id
    GROUP BY articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url
    ORDER BY articles.created_at DESC;
  `);
};

exports.fetchCommentsByArticle = (article_id) => {
  return db.query(
    `
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
  `,
    [article_id]
  );
};

exports.createComment = (article_id, username, body) => {
  return db
    .query(
      `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.fetchCommentByID = (comment_id) => {
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE comment_id = $1
    `,
      [comment_id]
    )
    .then(({ rows }) => {
      const comment = rows[0];
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "No comment found with that ID",
        });
      }
      return comment;
    });
};

exports.removeComment = (comment_id) => {
  return db.query(
    `
        DELETE FROM comments
        WHERE comment_id = $1
    `,
    [comment_id]
  );
};
