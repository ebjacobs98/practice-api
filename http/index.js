const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 9000;
const connect = require("../db/db");
const { errorHandler } = require("../middleware/errorHandler");
const cors = require("cors");
const indexRouter = require("../routes/index");
const userRouter = require("../routes/userRoutes");

connect();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", indexRouter);

app.use("/users", userRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log("listening on port 9000");
});
