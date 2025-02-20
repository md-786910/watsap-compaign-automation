const Redis = require("ioredis");

class RedisConnection {
  constructor() {
    if (!process.env.REDIS_URI) {
      throw new Error("❌ REDIS_URI is missing! Check your .env file.");
    }
    const serviceUri = process.env.REDIS_URI;

    if (!RedisConnection.instance) {
      this.client = new Redis(serviceUri.toString(), {
        maxRetriesPerRequest: null,
        retryStrategy: (times) => Math.min(times * 50, 2000),
      });

      this.client.on("connect", () => console.log("🔗 Redis connected"));
      this.client.on("error", (err) => {
        console.log(err);
        throw new Error("Redis connection error:", err);
      });
      RedisConnection.instance = this;
    }

    return RedisConnection.instance;
  }

  getClient() {
    return this.client;
  }
}

const redisInstance = new RedisConnection();
const initRedis = redisInstance.getClient();
module.exports = initRedis;
