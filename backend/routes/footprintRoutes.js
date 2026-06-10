const express = require("express");
const router = express.Router();
const {
  calculateSingleFootprint,
  recalculateAllFootprints,
  getTotalFootprint,
  getFootprintTrend,
  getEmissionFactors,
} = require("../controllers/footprintController");
const { protect } = require("../middleware/authMiddleware");

router.get("/factors", protect, getEmissionFactors);
router.get("/total", protect, getTotalFootprint);
router.get("/trend", protect, getFootprintTrend);
router.post("/recalculate-all", protect, recalculateAllFootprints);
router.post("/calculate/:activityId", protect, calculateSingleFootprint);

module.exports = router;