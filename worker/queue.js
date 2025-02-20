const { Queue } = require("bullmq");
const initRedis = require("./initRedis");
const { QUEUE_NAME } = require("../config/appconfig");

// Connect to Redis
const messageQueue = new Queue(QUEUE_NAME, { connection: initRedis });
module.exports = { messageQueue };
