const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, organization } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const user = await User.create({ name, email, password, organization: organization || null });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    console.error("GETME ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const applyAsProvider = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "user") {
      return res.status(400).json({ message: "Only regular users can apply" });
    }
    user.providerStatus = "pending";
    await user.save();
    res.status(200).json({ message: "Provider application submitted", providerStatus: user.providerStatus });
  } catch (error) {
    console.error("APPLY PROVIDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.organization !== undefined) user.organization = req.body.organization;

    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      providerStatus: user.providerStatus,
      token: req.headers.authorization ? req.headers.authorization.split(" ")[1] : null,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const User = require("../models/User");
    const ChallengeParticipant = require("../models/ChallengeParticipant");
    const Activity = require("../models/Activity");

    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User profile not found" });

    const challengeStats = await ChallengeParticipant.aggregate([
      { $match: { user: user._id, isCompleted: true } },
      {
        $group: {
          _id: "$user",
          totalPoints: { $sum: "$pointsEarned" },
          challengesCompleted: { $sum: 1 },
        },
      },
    ]);

    const footprintStats = await Activity.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: "$user",
          totalCO2: { $sum: "$co2Emitted" },
          totalLogs: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
        createdAt: user.createdAt,
      },
      totalPoints: challengeStats[0]?.totalPoints || 0,
      challengesCompleted: challengeStats[0]?.challengesCompleted || 0,
      totalCO2Tracked: Math.round((footprintStats[0]?.totalCO2 || 0) * 10) / 10,
      totalLogs: footprintStats[0]?.totalLogs || 0,
    });
  } catch (error) {
    console.error("GET USER PROFILE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, applyAsProvider, updateProfile, getUserProfile };