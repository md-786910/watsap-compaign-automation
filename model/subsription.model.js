const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    subscriptionName: {
      type: String,
      required: true,
    },
    credit: {
      type: Number,
      default: 500,
      required: true,
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
      required: true,
    },
    subscriptionPlan: {
      type: String,
      enum: ["free"],
      default: "free",
      required: true,
    },
    subscriptionStartDate: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    subscriptionEndDate: {
      type: Date,
      default: Date.now() + 30 * 24 * 60 * 60 * 1000,
      required: true,
    },
    subscriptionPrice: {
      type: Number,
      required: true,
    },
    subscriptionTrialPeriod: {
      type: Number,
      default: 30, //30din
      required: true,
    },
  },
  { timestamps: true }
);
