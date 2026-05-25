const mongoose = require("mongoose");

const challengeParticipantSchema = new mongoose.Schema(
  {
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    progressValue: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Prevent a user from joining the same challenge twice
challengeParticipantSchema.index({ challenge: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("ChallengeParticipant", challengeParticipantSchema);