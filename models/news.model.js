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
