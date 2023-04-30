// This code was heavily influenced from the following tutorials
// https://www.youtube.com/watch?v=CvCiNeLnZ00&ab_channel=DaveGray
// https://www.youtube.com/watch?v=-0exw-9YJBo&ab_channel=TraversyMedia
// https://www.youtube.com/watch?v=mvfsC66xqj0&t=3307s&ab_channel=TraversyMedia

const mongoose = require("mongoose");

const connect = async () => {
  try {
    mongoose.connect(process.env.MONGO_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connect;
