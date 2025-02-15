const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active_subscription: {
      type: Boolean,
      default: true,
    },
    total_credit: {
      type: Number,
      default: 300,
    },
    used_credit: {
      type: Number,
      default: 0,
    },
    remaining_credit: {
      type: Number,
      default: 300,
    },

    // activeSubscription: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Subscription",
    //   default: null,
    // },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
