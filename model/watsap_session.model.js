const mongoose = require("mongoose");

const watsappSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    user: String,
    session_id: String,
    phone_number: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    device: {
      type: String,
    },
    folder: {
      type: String,
      default: ".wwebjs_auth",
    },
  },
  { timestamps: true }
);

const WatsappSession = mongoose.model("WatsappSession", watsappSessionSchema);
module.exports = WatsappSession;
