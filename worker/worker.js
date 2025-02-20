const { Worker } = require("bullmq");
// const { sendMessageWithRetry } = require("./messageService");
const initRedis = require("./initRedis");
const { QUEUE_NAME } = require("../config/appconfig");

const worker = new Worker(
  QUEUE_NAME,
  async (job) => {
    console.log(job.data);
    // const { phoneNumber, name, userId } = job.data;
    // await sendMessageWithRetry({
    //   chatId: `${phoneNumber}@c.us`,
    //   name,
    //   client,
    //   userId,
    // });
    // console.log(`Message sent to ${phoneNumber}`);
  },
  { connection: initRedis }
);

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed: ${err.message}`);
});
