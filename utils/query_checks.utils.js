const { fetchTopics } = require("../models/news.model");

exports.invalidTopic = (topic) => {
  return fetchTopics()
    .then(({ rows }) => {
      let validTopics = [];
      rows.forEach((row) => validTopics.push(row.slug));
      return !validTopics.includes(topic);
    })
    .then((result) => {
      if (result) {
        return Promise.reject({ status: 400, msg: "No such topic exists" });
      }
    });
};

exports.invalidOrder = (order) => {
  const validOrders = {
    asc: "asc",
    desc: "desc",
  };
  if (validOrders[order]) {
    return Promise.resolve();
  } else {
    return Promise.reject({ status: 400, msg: "Order must be asc or desc" });
  }
};

exports.invalidSortBy = (sort_by) => {
  const validSorts = {
    author: "articles.author",
    title: "title",
    article_id: "article_id",
    topic: "topic",
    created_at: "created_at",
    votes: "votes",
    article_img_url: "article_img_url",
    comment_count: "comment_count",
  };
  if (validSorts[sort_by]) {
    return Promise.resolve();
  } else {
    return Promise.reject({
      status: 400,
      msg: "Sort_by must be a vaild column name",
    });
  }
};
