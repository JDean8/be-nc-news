\c nc_news_test

SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comment_id) AS comment_count FROM articles
LEFT JOIN comments on comments.article_id = articles.article_id
GROUP BY articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url;

SELECT * FROM articles;

SELECT * FROM comments;