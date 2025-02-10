const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const host = process.env.MONGO_HOST;
    const port = process.env.MONGO_PORT;
    const database = process.env.MONGO_DBNAME;
    // const uri = `mongodb://${host}:${port}/${database}`;
    // const uri  = "mongodb+srv://mdashifreza786910:2KY9Sq4alYZQTruj@<undefined.mongodb.net/test?retryWrites=true&w=majority"
    const uri  = "mongodb+srv://mdashifreza786910:2KY9Sq4alYZQTruj@cluster0.6hq3n.mongodb.net/watsapp?retryWrites=true&w=majority"
    // const uri = process.env.MONGO_URI;
    const connectionStatus = await mongoose.connect(uri, {});
    console.log("Connected to MongoDB");
    return connectionStatus;
  } catch (error) {
    throw new Error(error.mesage);
  }
};

module.exports = { dbConnect };
