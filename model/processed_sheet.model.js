const mongoose = require("mongoose");

const processedSheetSchema = new mongoose.Schema(
  {
    fileName: String,
    name: String,
    phone_number: String,
  },
  {
    timestamps: true,
  }
);
processedSheetSchema.index({ phone_number: 1 }, { unique: true });
const processedSheet = mongoose.model("processedSheet", processedSheetSchema);
module.exports = processedSheet;
