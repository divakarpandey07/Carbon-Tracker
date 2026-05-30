const mongoose = require("mongoose");

const teamContributionSchema = new mongoose.Schema(
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
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    contributionValue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// One contribution record per user per challenge
teamContributionSchema.index({ challenge: 1, user: 1 }, { unique: true });
teamContributionSchema.index({ challenge: 1, organization: 1 });

module.exports = mongoose.model("TeamContribution", teamContributionSchema);