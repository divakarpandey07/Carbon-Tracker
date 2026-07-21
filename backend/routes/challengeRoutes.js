const express = require("express");
const router = express.Router();
const {
  createChallenge,
  getChallenges,
  getMyChallenges,
  getChallengeById,
  joinChallenge,
  updateProgress,
  getLeaderboard,
} = require("../controllers/challengeController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Specific routes before dynamic :id routes
router.get("/leaderboard", protect, getLeaderboard);
router.get("/my-challenges", protect, getMyChallenges);

router.route("/")
  .post(protect, authorize("admin"), createChallenge)
  .get(protect, getChallenges);

router.get("/:id", protect, getChallengeById);
router.post("/:id/join", protect, joinChallenge);
router.put("/:id/progress", protect, updateProgress);

module.exports = router;