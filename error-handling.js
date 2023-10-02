exports.noValidEndpoint = (req, res, next) => {
  res.status(404).send({ msg: "No such endpoint found" });
};

exports.uncaughtError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "An unhandled server error has occurred" });
};
