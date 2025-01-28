const mongoose = require("mongoose");

// @connect to db
const dbConnect = async () => {
  try {
    // MongoDB connection
    mongoose.connect("mongodb://localhost:27017/whatsappAutomation", {});
    mongoose.connection.on("connected", () => {
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    throw new Error(error.mesage);
  }
};

module.exports = { dbConnect };
