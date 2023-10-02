db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`);
};

exports.fetchArticleByID = (article_id) => {
  return db.query(
    `
    SELECT * FROM articles
    WHERE article_id = $1
    `,
    [article_id]
  );
};

exports.fetchArticles = () => {
  return db.query(`
    
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id)::INT AS comment_count FROM articles
    LEFT JOIN comments on comments.article_id = articles.article_id
    GROUP BY articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url
    ORDER BY articles.created_at DESC;
  `);
};
