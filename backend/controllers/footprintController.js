const Activity = require("../models/Activity");
const { emissionFactors, calculateCO2 } = require("../utils/emissionFactors");

// @desc    Calculate & save CO2 for a single activity
// @route   POST /api/footprint/calculate/:activityId
// @access  Private
const calculateSingleFootprint = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const co2 = calculateCO2(activity.category, activity.subType, activity.quantity);
    activity.co2Emitted = co2;
    await activity.save();

    res.status(200).json({ message: "Footprint calculated", activity });
  } catch (error) {
    console.error("CALCULATE FOOTPRINT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Recalculate CO2 for ALL of the user's activities (bulk)
// @route   POST /api/footprint/recalculate-all
// @access  Private
const recalculateAllFootprints = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id });

    let updatedCount = 0;

    for (const activity of activities) {
      const co2 = calculateCO2(activity.category, activity.subType, activity.quantity);
      activity.co2Emitted = co2;
      await activity.save();
      updatedCount++;
    }

    res.status(200).json({ message: `Recalculated ${updatedCount} activities` });
  } catch (error) {
    console.error("RECALCULATE ALL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's total footprint with category breakdown
// @route   GET /api/footprint/total
// @access  Private
const getTotalFootprint = async (req, res) => {
  try {
    const result = await Activity.aggregate([
      { $match: { user: req.user._id, co2Emitted: { $ne: null } } },
      {
        $group: {
          _id: "$category",
          totalCO2: { $sum: "$co2Emitted" },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalCO2: -1 } },
    ]);

    const grandTotal = result.reduce((sum, r) => sum + r.totalCO2, 0);

    res.status(200).json({
      grandTotalCO2: Math.round(grandTotal * 1000) / 1000,
      breakdown: result,
    });
  } catch (error) {
    console.error("TOTAL FOOTPRINT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get footprint trend over time (grouped by month)
// @route   GET /api/footprint/trend?months=6
// @access  Private
const getFootprintTrend = async (req, res) => {
  try {
    const months = Number(req.query.months) || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const trend = await Activity.aggregate([
      {
        $match: {
          user: req.user._id,
          co2Emitted: { $ne: null },
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          totalCO2: { $sum: "$co2Emitted" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const formatted = trend.map((t) => ({
      period: `${t._id.year}-${String(t._id.month).padStart(2, "0")}`,
      totalCO2: Math.round(t.totalCO2 * 1000) / 1000,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("TREND ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all emission factors (reference table)
// @route   GET /api/footprint/factors
// @access  Private
const getEmissionFactors = async (req, res) => {
  try {
    res.status(200).json(emissionFactors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  calculateSingleFootprint,
  recalculateAllFootprints,
  getTotalFootprint,
  getFootprintTrend,
  getEmissionFactors,
};