const express = require("express");
const {
  register,
  login,
  logout,
  profile,
} = require("../controller/userController");
const userRoute = express.Router();

// @post[register]
userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.post("/logout", logout);

userRoute.get("/profile", profile);

module.exports = userRoute;
