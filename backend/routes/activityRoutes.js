const express = require("express");
const router = express.Router();
const {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  getActivitiesByCategory,
  getActivitySummary,
} = require("../controllers/activityController");
const { protect } = require("../middleware/authMiddleware");

// IMPORTANT: specific routes before dynamic :id routes
router.get("/summary", protect, getActivitySummary);
router.get("/category/:category", protect, getActivitiesByCategory);

router.route("/")
  .post(protect, createActivity)
  .get(protect, getActivities);

router.route("/:id")
  .get(protect, getActivityById)
  .put(protect, updateActivity)
  .delete(protect, deleteActivity);

module.exports = router;