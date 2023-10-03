exports.noValidEndpoint = (req, res, next) => {
  res.status(404).send({ msg: "No such endpoint found" });
};

exports.uncaughtError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "An unhandled server error has occurred" });
};

exports.customError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.psqlError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request, invalid type" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Missing required field" });
  } else if (err.constraint === "comments_article_id_fkey") {
    res.status(404).send({ msg: "No article found with that ID" });
  } else if (err.constraint === "comments_author_fkey") {
    res.status(404).send({ msg: "Username not recognised" });
  } else {
    next(err);
  }
};
