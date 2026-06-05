const express = require("express");
const router = express.Router();
const {
  getOverview,
  getComparison,
  getCategoryTrends,
  getNetImpact,
  getStreaks,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/overview", protect, getOverview);
router.get("/comparison", protect, getComparison);
router.get("/category-trends", protect, getCategoryTrends);
router.get("/net-impact", protect, getNetImpact);
router.get("/streaks", protect, getStreaks);

module.exports = router;