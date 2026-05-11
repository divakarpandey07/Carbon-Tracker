const User = require("../models/User");
const Activity = require("../models/Activity");
const Order = require("../models/Order");
const OffsetListing = require("../models/OffsetListing");
const Post = require("../models/Post");

// @desc    List all users (with filters)
// @route   GET /api/admin/users?role=&search=&page=&limit=
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      users,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) {
    console.error("GET ALL USERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Activate/deactivate a user account
// @route   PUT /api/admin/users/:id/status
// @access  Admin
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({ message: "isActive (true/false) is required" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({ message: `User ${isActive ? "activated" : "deactivated"}`, user });
  } catch (error) {
    console.error("UPDATE USER STATUS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Platform-wide statistics
// @route   GET /api/admin/stats
// @access  Admin
const getPlatformStats = async (req, res) => {
  try {
    const [totalUsers, totalProviders, totalActivities, totalCO2, totalOrders, totalRevenue] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "provider", providerStatus: "verified" }),
      Activity.countDocuments(),
      Activity.aggregate([
        { $match: { co2Emitted: { $ne: null } } },
        { $group: { _id: null, total: { $sum: "$co2Emitted" } } },
      ]),
      Order.countDocuments({ status: "paid" }),
      Order.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    res.status(200).json({
      totalUsers,
      totalProviders,
      totalActivities,
      totalCO2Tracked: Math.round((totalCO2[0]?.total || 0) * 1000) / 1000,
      totalOrders,
      totalRevenue: Math.round((totalRevenue[0]?.total || 0) * 100) / 100,
    });
  } catch (error) {
    console.error("PLATFORM STATS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Force-remove any marketplace listing (moderation)
// @route   DELETE /api/admin/listings/:id
// @access  Admin
const removeListing = async (req, res) => {
  try {
    const listing = await OffsetListing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    await listing.deleteOne();
    res.status(200).json({ message: "Listing removed by admin" });
  } catch (error) {
    console.error("REMOVE LISTING ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Force-remove any community post (moderation)
// @route   DELETE /api/admin/posts/:id
// @access  Admin
const removePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post removed by admin" });
  } catch (error) {
    console.error("REMOVE POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, updateUserStatus, getPlatformStats, removeListing, removePost };