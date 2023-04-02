const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

const getUsers = asyncHandler(async (req, res) => {
  const { userIds } = req.body;

  if (!userIds) {
    res.status(400);
    throw new Error("Missing required body fields");
  }

  const users = await User.find({ _id: { $in: userIds } }).select(
    "name topics"
  );

  return res.status(200).json(users);
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Missing required body fields");
  }

  const alreadyExists = await User.findOne({ email });

  if (alreadyExists) {
    res.status(400);
    throw new Error("Email in use by other user");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const createdUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (createdUser) {
    res.status(201).json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      token: generateToken(createdUser._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Missing required body fields");
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id, name, email, topics } = await User.findById(req.user._id);
  res.status(200).json({ id: _id, name, email, topics });
});

const updateTopic = asyncHandler(async (req, res) => {
  const { type, score } = req.body;
  if (!type || !score) {
    res.status(400);
    throw new Error("Missing required body fields");
  }

  const { topics, _id } = await User.findById(req.user._id);
  const highScore =
    score < topics[type].fastestTime || topics[type].fastestTime === 0
      ? score
      : topics[type].fastestTime;

  await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      [`topics.${type}.questionsAnswered`]: topics[type].questionsAnswered + 3,
      [`topics.${type}.fastestTime`]: highScore,
      [`topics.${type}.metrics`]: [...topics[type].metrics, score],
    }
  );
  res.status(200).json({ id: _id, topics });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const updateUser = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Missing required fields in Body");
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { name: name },
    { new: true }
  );
  return res.status(200).json(updatedUser);
});

module.exports = {
  getUsers,
  createUser,
  updateUser,
  loginUser,
  getCurrentUser,
  updateTopic,
};
