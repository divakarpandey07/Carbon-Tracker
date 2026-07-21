const Activity = require("../models/Activity");
const { calculateCO2 } = require("../utils/emissionFactors");

// @desc    Create new activity log
// @route   POST /api/activities
// @access  Private
const createActivity = async (req, res) => {
  try {
    const { category, subType, quantity, unit, date, notes, metadata } = req.body;

    if (!category || !subType || quantity === undefined || !unit) {
      return res.status(400).json({ message: "category, subType, quantity, and unit are required" });
    }

    const co2Emitted = calculateCO2(category, subType, quantity, metadata);
    const activity = await Activity.create({
      user: req.user._id,
      category,
      subType,
      quantity,
      unit,
      date: date || Date.now(),
      notes,
      metadata: metadata || {},
      co2Emitted,
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error("CREATE ACTIVITY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all activity logs for logged-in user (with filters + pagination)
// @route   GET /api/activities?category=&startDate=&endDate=&page=&limit=
// @access  Private
const getActivities = async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };

    if (category) query.category = category;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [activities, total] = await Promise.all([
      Activity.find(query).sort({ date: -1 }).skip(skip).limit(Number(limit)),
      Activity.countDocuments(query),
    ]);

    res.status(200).json({
      activities,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("GET ACTIVITIES ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single activity log
// @route   GET /api/activities/:id
// @access  Private
const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Ensure users can only view their own logs
    if (activity.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this activity" });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.error("GET ACTIVITY BY ID ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update activity log
// @route   PUT /api/activities/:id
// @access  Private
const updateActivity = async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this activity" });
    }

    const { category, subType, quantity, unit, date, notes, metadata } = req.body;

    activity.category = category ?? activity.category;
    activity.subType = subType ?? activity.subType;
    activity.quantity = quantity ?? activity.quantity;
    activity.unit = unit ?? activity.unit;
    activity.date = date ?? activity.date;
    activity.notes = notes ?? activity.notes;
    if (metadata !== undefined) {
      activity.metadata = metadata;
    }

    // Reset co2Emitted since values changed — will be recalculated
    activity.co2Emitted = calculateCO2(activity.category, activity.subType, activity.quantity, activity.metadata);

    await activity.save();

    res.status(200).json(activity);
  } catch (error) {
    console.error("UPDATE ACTIVITY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete activity log
// @route   DELETE /api/activities/:id
// @access  Private
const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    if (activity.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this activity" });
    }

    await activity.deleteOne();

    res.status(200).json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("DELETE ACTIVITY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get activities filtered by category
// @route   GET /api/activities/category/:category
// @access  Private
const getActivitiesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const validCategories = ["transport", "food", "electricity", "water", "gas", "waste", "other"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const activities = await Activity.find({ user: req.user._id, category }).sort({ date: -1 });

    res.status(200).json(activities);
  } catch (error) {
    console.error("GET BY CATEGORY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get summary of activities (counts + totals per category)
// @route   GET /api/activities/summary
// @access  Private
const getActivitySummary = async (req, res) => {
  try {
    const summary = await Activity.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$category",
          totalLogs: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalCO2: { $sum: { $ifNull: ["$co2Emitted", 0] } },
        },
      },
      { $sort: { totalCO2: -1 } },
    ]);

    const totalLogsCount = await Activity.countDocuments({ user: req.user._id });

    res.status(200).json({
      totalLogsCount,
      byCategory: summary,
    });
  } catch (error) {
    console.error("SUMMARY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  getActivitiesByCategory,
  getActivitySummary,
};