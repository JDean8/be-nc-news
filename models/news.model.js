const db = require("../db/connection");
const format = require("pg-format");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`);
};

exports.fetchArticleByID = (article_id) => {
  return db
    .query(
      `
      SELECT
      articles.article_id, article_img_url, articles.author, articles.body, articles.created_at, title, topic, articles.votes,
      COUNT(comment_id)::INT AS comment_count
      FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY
      articles.article_id, article_img_url, articles.author, articles.body, articles.created_at, title, topic, articles.votes
      HAVING articles.article_id = $1;
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

exports.fetchArticles = (
  sortTopic,
  sort_by = "articles.created_at",
  order = "desc",
  limit = 10,
  page = 1
) => {
  let values = [];
  let query = ` SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id)::INT AS comment_count FROM articles
                LEFT JOIN comments on comments.article_id = articles.article_id `;
  if (sortTopic) {
    values.push(sortTopic);
    query += `WHERE topic = $${values.length} `;
  }
  const offset = page * 10 - 10;
  query += format(
    ` GROUP BY articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url
      ORDER BY %s %s
      LIMIT %s OFFSET %s;`,
    sort_by,
    order,
    limit,
    offset
  );
  return db.query(query, values);
};

exports.fetchCommentsByArticle = (article_id, limit = 10, page = 1) => {
  const offset = page * 10 - 10;
  return db.query(
    format(
      `
    SELECT * FROM comments
    WHERE article_id = %s
    ORDER BY created_at DESC
    LIMIT %s OFFSET %s;`,
      article_id,
      limit,
      offset
    )
  );
};

exports.updateArticle = (article_id, current_votes, vote_change) => {
  const new_votes = current_votes + vote_change;
  return db
    .query(
      `
      UPDATE articles
      SET votes = $1
      WHERE article_id = $2
      RETURNING *
  `,
      [new_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
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

exports.updateComment = (comment_id, current_votes, vote_change) => {
  const new_votes = current_votes + vote_change;
  return db
    .query(
      `
        UPDATE comments
        SET votes = $1
        WHERE comment_id = $2
        RETURNING *
    `,
      [new_votes, comment_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => rows);
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No such user found" });
      } else {
        return rows[0];
      }
    });
};

exports.createPost = (author, title, body, topic, article_img_url) => {
  return db
    .query(
      `
  INSERT INTO articles (author, title, body, topic, article_img_url)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
  `,
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.createTopic = (slug, description) => {
  return db
    .query(
      `
      INSERT INTO topics
      (slug, description)
      VALUES ($1, $2)
      RETURNING *;
      `,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeArticle = (article_id) => {
  return db.query(
    `
        DELETE FROM articles
        WHERE article_id = $1
    `,
    [article_id]
  );
};
