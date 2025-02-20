const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    documentUrl: {
      type: String,
      default: "",
    },
    audioUrl: {
      type: String,
      default: "",
    },
    imageName: {
      type: String,
      default: "",
    },
    documentName: {
      type: String,
      default: "",
    },
    audioName: {
      type: String,
      default: "",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Template = mongoose.model("Template", templateSchema);

module.exports = Template;
