const { promisify } = require("util");
const initRedis = require("./initRedis");

const client = initRedis;

// Promisify Redis methods for async/await
const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);
const delAsync = promisify(client.del).bind(client);

module.exports = { client, setAsync, getAsync, delAsync };
