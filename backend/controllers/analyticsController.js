const Activity = require("../models/Activity");
const Order = require("../models/Order");
const ChallengeParticipant = require("../models/ChallengeParticipant");
const User = require("../models/User");

// @desc    Combined overview stats for dashboard
// @route   GET /api/analytics/overview
// @access  Private
const getOverview = async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalFootprint, totalOffsets, challengesCompleted, totalActivities] = await Promise.all([
      Activity.aggregate([
        { $match: { user: userId, co2Emitted: { $ne: null } } },
        { $group: { _id: null, total: { $sum: "$co2Emitted" } } },
      ]),
      Order.aggregate([
        { $match: { user: userId, status: "paid" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]),
      ChallengeParticipant.countDocuments({ user: userId, isCompleted: true }),
      Activity.countDocuments({ user: userId }),
    ]);

    res.status(200).json({
      totalFootprintCO2: totalFootprint[0]?.total ? Math.round(totalFootprint[0].total * 1000) / 1000 : 0,
      totalOffsetsPurchased: totalOffsets[0]?.total || 0,
      challengesCompleted,
      totalActivities,
    });
  } catch (error) {
    console.error("OVERVIEW ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Compare user's footprint vs platform average
// @route   GET /api/analytics/comparison
// @access  Private
const getComparison = async (req, res) => {
  try {
    const userId = req.user._id;

    const [userTotal, platformAvg] = await Promise.all([
      Activity.aggregate([
        { $match: { user: userId, co2Emitted: { $ne: null } } },
        { $group: { _id: null, total: { $sum: "$co2Emitted" } } },
      ]),
      Activity.aggregate([
        { $match: { co2Emitted: { $ne: null } } },
        { $group: { _id: "$user", userTotal: { $sum: "$co2Emitted" } } },
        { $group: { _id: null, avgTotal: { $avg: "$userTotal" } } },
      ]),
    ]);

    const userCO2 = userTotal[0]?.total || 0;
    const avgCO2 = platformAvg[0]?.avgTotal || 0;

    res.status(200).json({
      yourFootprint: Math.round(userCO2 * 1000) / 1000,
      platformAverage: Math.round(avgCO2 * 1000) / 1000,
      difference: Math.round((userCO2 - avgCO2) * 1000) / 1000,
      comparedToPlatform: avgCO2 > 0 ? (userCO2 < avgCO2 ? "below_average" : "above_average") : "no_data",
    });
  } catch (error) {
    console.error("COMPARISON ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Category-wise trend over time (monthly)
// @route   GET /api/analytics/category-trends?months=6
// @access  Private
const getCategoryTrends = async (req, res) => {
  try {
    const months = Number(req.query.months) || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const trends = await Activity.aggregate([
      {
        $match: {
          user: req.user._id,
          co2Emitted: { $ne: null },
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            category: "$category",
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalCO2: { $sum: "$co2Emitted" },
        },
      },
      {
        $group: {
          _id: { year: "$_id.year", month: "$_id.month" },
          categories: {
            $push: { category: "$_id.category", totalCO2: "$totalCO2" },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const formatted = trends.map((t) => ({
      period: `${t._id.year}-${String(t._id.month).padStart(2, "0")}`,
      categories: t.categories,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("CATEGORY TRENDS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Net impact = footprint emitted MINUS offsets purchased
// @route   GET /api/analytics/net-impact
// @access  Private
const getNetImpact = async (req, res) => {
  try {
    const userId = req.user._id;

    const [footprint, offsets] = await Promise.all([
      Activity.aggregate([
        { $match: { user: userId, co2Emitted: { $ne: null } } },
        { $group: { _id: null, total: { $sum: "$co2Emitted" } } },
      ]),
      Order.aggregate([
        { $match: { user: userId, status: "paid" } },
        { $group: { _id: null, total: { $sum: "$quantity" } } },
      ]),
    ]);

    const emitted = footprint[0]?.total || 0;
    const offset = offsets[0]?.total || 0;
    const netImpact = Math.round((emitted - offset) * 1000) / 1000;

    res.status(200).json({
      totalEmitted: Math.round(emitted * 1000) / 1000,
      totalOffset: Math.round(offset * 1000) / 1000,
      netImpact,
      status: netImpact <= 0 ? "carbon_negative_or_neutral" : "carbon_positive",
    });
  } catch (error) {
    console.error("NET IMPACT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Activity logging streaks (consecutive days with at least one log)
// @route   GET /api/analytics/streaks
// @access  Private
const getStreaks = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id })
      .select("date")
      .sort({ date: -1 });

    if (activities.length === 0) {
      return res.status(200).json({ currentStreak: 0, longestStreak: 0 });
    }

    // Get unique dates (as YYYY-MM-DD strings)
    const uniqueDates = [
      ...new Set(activities.map((a) => a.date.toISOString().split("T")[0])),
    ].sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 1;
    let longestStreak = 1;
    let tempStreak = 1;

    // Check if streak is "current" (most recent log is today or yesterday)
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const isCurrentActive = uniqueDates[0] === today || uniqueDates[0] === yesterday;

    for (let i = 1; i < uniqueDates.length; i++) {
      const curr = new Date(uniqueDates[i - 1]);
      const prev = new Date(uniqueDates[i]);
      const diffDays = Math.round((curr - prev) / 86400000);

      if (diffDays === 1) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    currentStreak = isCurrentActive ? tempStreak : 0;
    // Recompute currentStreak properly by walking from the most recent date
    if (isCurrentActive) {
      currentStreak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const curr = new Date(uniqueDates[i - 1]);
        const prev = new Date(uniqueDates[i]);
        const diffDays = Math.round((curr - prev) / 86400000);
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    } else {
      currentStreak = 0;
    }

    res.status(200).json({ currentStreak, longestStreak });
  } catch (error) {
    console.error("STREAKS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getOverview, getComparison, getCategoryTrends, getNetImpact, getStreaks };