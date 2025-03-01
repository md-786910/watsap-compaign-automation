const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const host = process.env.MONGO_HOST;
    const port = process.env.MONGO_PORT;
    const database = process.env.MONGO_DBNAME;

    if (process.env.MONGO_URI) {
      uri = process.env.MONGO_URI;
    } else {
      uri = `mongodb://${host}:${port}/${database}`;
    }
    const connectionStatus = await mongoose.connect(uri, {});
    console.log("Connected to MongoDB");
    return connectionStatus;
  } catch (error) {
    throw new Error(error.mesage);
  }
};

module.exports = { dbConnect };
