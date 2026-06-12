const express = require("express");
const router = express.Router();
const {
  createTeamChallenge,
  getTeamChallenges,
  joinTeamChallenge,
  getTeamLeaderboard,
  contributeToTeam,
} = require("../controllers/teamChallengeController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/")
  .post(protect, authorize("admin"), createTeamChallenge)
  .get(protect, getTeamChallenges);

router.post("/:id/join", protect, joinTeamChallenge);
router.get("/:id/team-leaderboard", protect, getTeamLeaderboard);
router.put("/:id/contribute", protect, contributeToTeam);

module.exports = router;