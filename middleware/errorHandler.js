// This code was heavily influenced from the following tutorials
// https://www.youtube.com/watch?v=CvCiNeLnZ00&ab_channel=DaveGray
// https://www.youtube.com/watch?v=-0exw-9YJBo&ab_channel=TraversyMedia
// https://www.youtube.com/watch?v=mvfsC66xqj0&t=3307s&ab_channel=TraversyMedia

const errorHandler = (err, req, res, next) => {
  console.log(err);
  const status = err.statusCode ? err.statusCode : 500;
  res.status(status);
  res.json({ message: err.message });
};

module.exports = {
  errorHandler,
};
