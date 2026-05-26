const mongoose = require("mongoose");

const offsetListingSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
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
    offsetType: {
      type: String,
      enum: ["tree_planting", "renewable_energy", "methane_capture", "ocean_conservation", "soil_carbon", "other"],
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: [true, "Price per unit is required"],
      min: 0,
    },
    unit: {
      type: String,
      default: "kg_co2",
    },
    availableQuantity: {
      type: Number,
      required: [true, "Available quantity is required"],
      min: 0,
    },
    location: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

offsetListingSchema.index({ offsetType: 1, isActive: 1 });

module.exports = mongoose.model("OffsetListing", offsetListingSchema);