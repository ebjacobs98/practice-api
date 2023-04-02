const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  loginUser,
  getCurrentUser,
  updateTopic,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.route("/").post(protect, getUsers).patch(protect, updateUser);

router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);
router.patch("/topic", protect, updateTopic);

module.exports = router;
