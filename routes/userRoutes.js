const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  loginUser,
  getCurrentUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.route("/").get(getUsers).patch(protect, updateUser);

router.post("/create", createUser);
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);

module.exports = router;
