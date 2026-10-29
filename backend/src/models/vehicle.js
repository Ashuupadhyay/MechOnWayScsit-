
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      index: true,
    },

    vehicleType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    capacity: {
      type: String,
      trim: true,
      default: "",
    },

    bodyType: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["available", "busy", "inactive"],
      default: "available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Vehicle ||
  mongoose.model("Vehicle", vehicleSchema);
