const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["transport", "food", "electricity", "water", "gas", "waste", "other"],
      required: [true, "Category is required"],
    },
    // Sub-type gives flexibility within a category
    // transport: car, bike, bus, train, flight, walk
    // food: meat, dairy, vegetarian, vegan
    // electricity/water/gas: units consumed
    subType: {
      type: String,
      required: [true, "Sub-type is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: 0,
    },
    unit: {
      type: String,
      enum: ["km", "miles", "kg", "meals", "kWh", "liters", "cubic_m", "hours", "count"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Filled in later by the Footprint Calculation Engine (Module 3)
    co2Emitted: {
      type: Number,
      default: null, // in kg CO2e
    },
  },
  { timestamps: true }
);

// Index for faster queries per user + date
activitySchema.index({ user: 1, date: -1 });
activitySchema.index({ user: 1, category: 1 });

module.exports = mongoose.model("Activity", activitySchema);