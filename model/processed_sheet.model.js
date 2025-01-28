const mongoose = require("mongoose");

const processedSheetSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
    },
    name: {
      type: String,
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);
const processedSheet = mongoose.model("processedSheet", processedSheetSchema);
module.exports = processedSheet;
