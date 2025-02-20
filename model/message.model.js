const mongoose = require("mongoose");
const { CODESTATUS } = require("../config/status");

const MessageLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    phoneNumber: { type: String, required: true },
    status: {
      type: String,
      enum: [...Object.values(CODESTATUS)],
      default: "pending",
    },
    reason: { type: String, default: null },
    count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const message = mongoose.model("MessageLog", MessageLogSchema);
module.exports = message;
