const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  updateUserStatus,
  getPlatformStats,
  removeListing,
  removePost,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("admin")); // all routes below require admin

router.get("/users", getAllUsers);
router.put("/users/:id/status", updateUserStatus);
router.get("/stats", getPlatformStats);
router.delete("/listings/:id", removeListing);
router.delete("/posts/:id", removePost);

module.exports = router;