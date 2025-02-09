const bcrypt = require("bcryptjs");

/**
 * Hash a password using bcrypt.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} - The hashed password.
 */
exports.hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error("Error hashing password:", error.message);
    throw new Error("Password hashing failed");
  }
};

/**
 * Compare a plain password with a hashed password.
 * @param {string} password - The plain text password.
 * @param {string} hashedPassword - The hashed password.
 * @returns {Promise<boolean>} - True if passwords match, otherwise false.
 */
exports.comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error("Error comparing password:", error.message);
    return false;
  }
};
