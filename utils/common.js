const { CODESTATUS } = require("../config/status");
const MessageLog = require("../model/message.model");
// Utility functions
const formatPhoneNumber = (phoneNumber) => phoneNumber.replace(/[\+\s]/g, "");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const insertLogsToDb = async (messageObj) => {
  try {
    await MessageLog.create(messageObj);
  } catch (error) {
    await MessageLog.create({
      ...messageObj,
      status: CODESTATUS.FAILED,
      reason: error.message,
    });
  }
};

// const RECIPIENTS = [...new Array(1)].map((_, index) => ({
//   id: index,
//   phoneNumber: "+916201991257",
//   name: `user-${index + 1}`,
// }));
const RECIPIENTS = [
  {
    id: 2,
    phoneNumber: "+916201991257",
    name: `user`,
  },
  {
    id: 2,
    phoneNumber: "+918083964947",
    name: `user`,
  },
  {
    id: 2,
    phoneNumber: "+917519134978",
    name: `user`,
  },
  {
    id: 2,
    phoneNumber: "+917519131228",
    name: `user`,
  },
];

const generatePassword64 = (byte = 64) => {
  const randomBytes = new Uint8Array(byte / 8); // 8 bits = 1 bytes
  crypto.getRandomValues(randomBytes); // Fill with random values
  return btoa(String.fromCharCode(...randomBytes));
};

module.exports = {
  formatPhoneNumber,
  delay,
  insertLogsToDb,
  RECIPIENTS,
  generatePassword64,
};
