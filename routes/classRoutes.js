const express = require("express");
const router = express.Router();
const {
  updatePendingStudent,
  updateConfirmedStudent,
  updateAssignedTopics,
  createClass,
  deleteClass,
  getClasses,
  getClass,
} = require("../controllers/classController.js");
const { protect } = require("../middleware/auth");

router.patch("/pendingStudent", protect, updatePendingStudent);
router.patch("/confirmedStudent", protect, updateConfirmedStudent);
router.patch("/assignedTopics", protect, updateAssignedTopics);
router.post("/class", protect, getClass);
router
  .route("/")
  .post(protect, createClass)
  .delete(protect, deleteClass)
  .get(protect, getClasses);

module.exports = router;
