const express = require("express");
const router = express.Router();
const {
  applyForProvider,
  getPendingApplications,
  getApplicationByUserId,
  approveApplication,
  rejectApplication,
} = require("../controllers/verificationController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/apply", protect, applyForProvider);
router.get("/pending", protect, authorize("admin"), getPendingApplications);
router.get("/:userId", protect, authorize("admin"), getApplicationByUserId);
router.put("/:userId/approve", protect, authorize("admin"), approveApplication);
router.put("/:userId/reject", protect, authorize("admin"), rejectApplication);

module.exports = router;