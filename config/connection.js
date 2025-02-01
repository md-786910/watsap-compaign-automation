const mongoose = require("mongoose");

// @connect to db
// MongoDB connection
const dbConnect = async () => {
  try {
    const host = process.env.MONGO_HOST;
    const port = process.env.MONGO_PORT;
    const database = process.env.MONGO_DBNAME;
    const uri = `mongodb://${host}:${port}/${database}`;
    const connectionStatus = await mongoose.connect(uri, {});
    console.log("Connected to MongoDB");
    return connectionStatus;
  } catch (error) {
    throw new Error(error.mesage);
  }
};

module.exports = { dbConnect };
