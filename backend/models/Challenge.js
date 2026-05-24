const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["transport", "food", "electricity", "water", "gas", "waste", "general"],
      default: "general",
    },
    targetType: {
      type: String,
      enum: ["reduce_co2", "log_count", "streak_days"],
      default: "reduce_co2",
    },
    targetValue: {
      type: Number,
      required: [true, "Target value is required"],
      min: 0,
    },
    pointsReward: {
      type: Number,
      default: 100,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isTeamChallenge: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Challenge", challengeSchema);