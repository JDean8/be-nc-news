\c nc_news_test

-- SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count FROM articles
-- LEFT JOIN comments on comments.article_id = articles.article_id
-- GROUP BY articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url;

-- SELECT * FROM articles;

-- SELECT * FROM comments;

SELECT
articles.article_id, article_img_url, articles.author, articles.body, articles.created_at, title, topic, articles.votes,
COUNT(comment_id)::INT AS comment_count
FROM articles JOIN comments ON articles.article_id = comments.article_id
GROUP BY
articles.article_id, article_img_url, articles.author, articles.body, articles.created_at, title, topic, articles.votes
HAVING articles.article_id = 1;