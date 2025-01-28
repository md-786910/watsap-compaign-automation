const winston = require("winston");

const logger = winston.createLogger({
  level: "error",
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "errors.log" }),
  ],
});

module.exports = logger;
