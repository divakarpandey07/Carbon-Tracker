const Challenge = require("../models/Challenge");
const ChallengeParticipant = require("../models/ChallengeParticipant");
const User = require("../models/User");

// @desc    Create a new challenge
// @route   POST /api/challenges
// @access  Admin only
const createChallenge = async (req, res) => {
  try {
    const { title, description, category, targetType, targetValue, pointsReward, startDate, endDate } = req.body;

    if (!title || !description || !targetValue || !startDate || !endDate) {
      return res.status(400).json({ message: "title, description, targetValue, startDate, endDate are required" });
    }

    const challenge = await Challenge.create({
      title,
      description,
      category,
      targetType,
      targetValue,
      pointsReward,
      startDate,
      endDate,
      createdBy: req.user._id,
    });

    res.status(201).json(challenge);
  } catch (error) {
    console.error("CREATE CHALLENGE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active challenges
// @route   GET /api/challenges
// @access  Private (any logged-in user)
const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true }).sort({ startDate: -1 });

    res.status(200).json(challenges);
  } catch (error) {
    console.error("GET CHALLENGES ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single challenge details (includes participant count + user's own progress)
// @route   GET /api/challenges/:id
// @access  Private
const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const participantCount = await ChallengeParticipant.countDocuments({ challenge: challenge._id });

    const myParticipation = await ChallengeParticipant.findOne({
      challenge: challenge._id,
      user: req.user._id,
    });

    res.status(200).json({
      challenge,
      participantCount,
      myParticipation: myParticipation || null,
    });
  } catch (error) {
    console.error("GET CHALLENGE BY ID ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a challenge
// @route   POST /api/challenges/:id/join
// @access  Private (user)
const joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    if (!challenge.isActive) {
      return res.status(400).json({ message: "This challenge is no longer active" });
    }

    const existing = await ChallengeParticipant.findOne({
      challenge: challenge._id,
      user: req.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: "You have already joined this challenge" });
    }

    const participant = await ChallengeParticipant.create({
      challenge: challenge._id,
      user: req.user._id,
    });

    res.status(201).json({ message: "Joined challenge successfully", participant });
  } catch (error) {
    console.error("JOIN CHALLENGE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update progress in a challenge (and auto-complete if target reached)
// @route   PUT /api/challenges/:id/progress
// @access  Private (user)
const updateProgress = async (req, res) => {
  try {
    const { progressValue } = req.body;

    if (progressValue === undefined) {
      return res.status(400).json({ message: "progressValue is required" });
    }

    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    const participant = await ChallengeParticipant.findOne({
      challenge: challenge._id,
      user: req.user._id,
    });

    if (!participant) {
      return res.status(404).json({ message: "You haven't joined this challenge yet" });
    }

    if (participant.isCompleted) {
      return res.status(400).json({ message: "Challenge already completed" });
    }

    participant.progressValue = progressValue;

    if (progressValue >= challenge.targetValue) {
      participant.isCompleted = true;
      participant.completedAt = new Date();
      participant.pointsEarned = challenge.pointsReward;
    }

    await participant.save();

    res.status(200).json({ message: "Progress updated", participant });
  } catch (error) {
    console.error("UPDATE PROGRESS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard (top users by total points earned across all challenges)
// @route   GET /api/challenges/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await ChallengeParticipant.aggregate([
      { $match: { isCompleted: true } },
      {
        $group: {
          _id: "$user",
          totalPoints: { $sum: "$pointsEarned" },
          challengesCompleted: { $sum: 1 },
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$userInfo.name",
          organization: "$userInfo.organization",
          totalPoints: 1,
          challengesCompleted: 1,
        },
      },
    ]);

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("LEADERBOARD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createChallenge,
  getChallenges,
  getChallengeById,
  joinChallenge,
  updateProgress,
  getLeaderboard,
};