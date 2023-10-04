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
