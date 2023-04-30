// This code was heavily influenced from the following tutorials
// https://www.youtube.com/watch?v=CvCiNeLnZ00&ab_channel=DaveGray
// https://www.youtube.com/watch?v=-0exw-9YJBo&ab_channel=TraversyMedia
// https://www.youtube.com/watch?v=mvfsC66xqj0&t=3307s&ab_channel=TraversyMedia

const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 9000;
const connect = require("../db/db");
const { errorHandler } = require("../middleware/errorHandler");
const cors = require("cors");
const indexRouter = require("../routes/index");
const userRouter = require("../routes/userRoutes");
const classRouter = require("../routes/classRoutes");

connect();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", indexRouter);

app.use("/users", userRouter);
app.use("/classes", classRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log("listening on port 9000");
});
