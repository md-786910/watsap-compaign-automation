const mongoose = require("mongoose");
const userSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);
const UserSession = mongoose.model("UserSession", userSessionSchema);

module.exports = UserSession;
