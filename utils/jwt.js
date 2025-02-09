const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

/**
 * Generates a JWT token.
 * @param {Object} payload - The data to be encoded into the token.
 * @returns {string|null} The signed JWT token.
 */
exports.generateToken = async (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    console.log(error);
    throw new Error("Error generating JWT token");
  }
};

/**
 * Verifies a JWT token.
 * @param {string} token - The JWT token to verify.
 * @returns {Object|null} Decoded payload if valid, otherwise null.
 */
exports.verifyToken = async (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.log(error);
    throw new Error("Error verifying JWT token");
  }
};
