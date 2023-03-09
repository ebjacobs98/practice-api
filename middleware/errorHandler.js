const errorHandler = (err, req, res, next) => {
  console.log(err);
  const status = err.statusCode ? err.statusCode : 500;
  res.status(status);
  res.json({ message: err.message });
};

module.exports = {
  errorHandler,
};
