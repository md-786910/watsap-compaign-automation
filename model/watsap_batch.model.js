const mongoose = require("mongoose");

const watsappBatchSchema = new mongoose.Schema(
  {
    batch_size: {
      type: Number,
      default: 20,
    },
    message_delay: {
      type: Number,
      default: 3000,
    },
    batch_delay: {
      type: Number,
      default: 30000,
    },
    retry_attempts: {
      type: Number,
      default: 3,
    },
    retry_delay: {
      type: Number,
      default: 5000,
    },
  },
  {
    timestamps: true,
  }
);
const WatsappBatch = mongoose.model("WatsappBatch", watsappBatchSchema);
module.exports = WatsappBatch;
