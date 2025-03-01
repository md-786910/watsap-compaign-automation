const redisClient = require("./initRedis");

// Wrap Redis commands in async functions
const setAsync = async (key, value, expire = 86400) => {
  return redisClient.set(key, JSON.stringify(value), "EX", expire);
};

const getAsync = async (key) => {
  return redisClient.get(key);
};

const delAsync = async (key) => {
  return redisClient.del(key);
};

module.exports = { setAsync, getAsync, delAsync };
