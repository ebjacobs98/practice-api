// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var usersRouter = require('./routes/users');
// var testApiRouter = require('./routes/testAPI');

// var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/users', usersRouter);
// app.use('/testAPI', testApiRouter)

//

// module.exports = app;

const express = require("express");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const cors = require("cors");
const indexRouter = require("../routes/index");

module.exports = ({ user }) => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  const router = express.Router();

  const getUsers = async (req, res) => {
    const users = await user.find({});
    console.log("users", users);
    console.log("user", user);
    return res.json(users);
  };

  const createDoug = async (req, res) => {
    const users = await user.findOneAndUpdate({ name: "Doug" });
    console.log("users", users);
    console.log("user", user);
    return res.json(users);
  };
  app.use("/", indexRouter);

  router.get("/", getUsers);
  app.use("/testAPI", router);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });

  app.listen(9000, () => {
    console.log("listening on port 9000");
  });
  return app;
};
