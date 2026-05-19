const Challenge = require("../models/Challenge");
const TeamContribution = require("../models/TeamContribution");

// @desc    Create a team/corporate challenge
// @route   POST /api/team-challenges
// @access  Admin
const createTeamChallenge = async (req, res) => {
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
      isTeamChallenge: true,
    });

    res.status(201).json(challenge);
  } catch (error) {
    console.error("CREATE TEAM CHALLENGE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    List active team challenges
// @route   GET /api/team-challenges
// @access  Private
const getTeamChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isTeamChallenge: true, isActive: true }).sort({ startDate: -1 });

    res.status(200).json(challenges);
  } catch (error) {
    console.error("GET TEAM CHALLENGES ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a team challenge with your organization
// @route   POST /api/team-challenges/:id/join
// @access  Private (must have organization set)
const joinTeamChallenge = async (req, res) => {
  try {
    if (!req.user.organization) {
      return res.status(400).json({
        message: "You must have an organization set on your profile to join team challenges",
      });
    }

    const challenge = await Challenge.findById(req.params.id);
    if (!challenge || !challenge.isTeamChallenge) {
      return res.status(404).json({ message: "Team challenge not found" });
    }

    const existing = await TeamContribution.findOne({ challenge: challenge._id, user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "You have already joined this team challenge" });
    }

    const contribution = await TeamContribution.create({
      challenge: challenge._id,
      user: req.user._id,
      organization: req.user.organization,
    });

    res.status(201).json({ message: "Joined team challenge", contribution });
  } catch (error) {
    console.error("JOIN TEAM CHALLENGE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Team-wise leaderboard (ranked by total org progress)
// @route   GET /api/team-challenges/:id/team-leaderboard
// @access  Private
const getTeamLeaderboard = async (req, res) => {
  try {
    const leaderboard = await TeamContribution.aggregate([
      { $match: { challenge: new (require("mongoose").Types.ObjectId)(req.params.id) } },
      {
        $group: {
          _id: "$organization",
          totalContribution: { $sum: "$contributionValue" },
          memberCount: { $sum: 1 },
        },
      },
      { $sort: { totalContribution: -1 } },
    ]);

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("TEAM LEADERBOARD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log individual contribution to team's total
// @route   PUT /api/team-challenges/:id/contribute
// @access  Private
const contributeToTeam = async (req, res) => {
  try {
    const { value } = req.body;

    if (value === undefined || value < 0) {
      return res.status(400).json({ message: "A valid contribution value is required" });
    }

    const contribution = await TeamContribution.findOne({
      challenge: req.params.id,
      user: req.user._id,
    });

    if (!contribution) {
      return res.status(404).json({ message: "You haven't joined this team challenge yet" });
    }

    contribution.contributionValue += Number(value);
    await contribution.save();

    res.status(200).json({ message: "Contribution logged", contribution });
  } catch (error) {
    console.error("CONTRIBUTE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTeamChallenge,
  getTeamChallenges,
  joinTeamChallenge,
  getTeamLeaderboard,
  contributeToTeam,
};