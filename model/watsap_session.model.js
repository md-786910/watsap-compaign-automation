const mongoose = require("mongoose");

const watsappSessionSchema = new mongoose.Schema(
  {
    session_id: String,
    folder: {
      type: String,
      default: ".wwebjs_auth",
    },
  },
  { timestamps: true }
);

const WatsappSession = mongoose.model("WatsappSession", watsappSessionSchema);
module.exports = WatsappSession;
