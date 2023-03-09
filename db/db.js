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
