const mongoose = require("mongoose");
mongoose.Promise = Promise;
require("dotenv").config();
const models = require("./models");
mongoose
  .connect(process.env.MONGO_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    require("./http")({ user: models.user });
  });
