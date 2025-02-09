const { AUTHENTICATION_TYPE } = require("../constant/authentication");
const User = require("../model/user.model");
const UserSession = require("../model/user_session.model");
const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const { hashPassword, comparePassword } = require("../utils/hashing");
const { generateToken } = require("../utils/jwt");

exports.register = CatchAsync(async (req, res, next) => {
  if (!req.body) return next(AppError("request body is required", 200));
  const {
    name,
    email,
    password,
    role,
    authentication_type = AUTHENTICATION_TYPE.EMAIL,
  } = req.body;
  if (!name || !email || !password) {
    return next(AppError("name, email and password are required", 200));
  }
  if (!role) {
    return next(AppError("role is required", 200));
  }

  const checkUser = await User.findOne({ email: email });
  if (checkUser) {
    return next(AppError("user already exist", 200));
  }
  // @register
  const hashedPassword =
    authentication_type === AUTHENTICATION_TYPE.GOOGLE
      ? ""
      : await hashPassword(password);
  const user = await User.create({
    email,
    password: hashedPassword,
    name,
    role,
    authentication_type,
  });

  res.status(200).json({
    status: "success",
    data: user,
    message: "user created successfully",
  });
});

exports.login = CatchAsync(async (req, res, next) => {
  if (!req.body) return next(AppError("request body is required", 200));
  const { email, password } = req.body;
  if (!email || !password) {
    return next(AppError("email and password are required", 200));
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return next(AppError("user not found", 200));
  }

  const isPasswordCorrect = await comparePassword(password, user.password);
  if (isPasswordCorrect) {
    return next(AppError("password is incorrect", 200));
  }

  // signed jwt token
  const jwt = await generateToken({
    _id: user._id,
    email: user.email,
    role: user.role,
    name: user.name,
    authentication_type: user.authentication_type,
  });

  //   store user seesion
  await UserSession.findByIdAndUpdate(
    { _id: user.id },
    {
      $set: {
        userId: user._id,
        token: jwt,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );
  //   set in cookies
  res.cookie("access_token", jwt, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // Prevents client-side access
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "Strict", // Prevent CSRF attacks
  });

  res.status(200).json({
    status: "success",
    data: user,
    message: "user login successfully",
  });
});

exports.logout = CatchAsync(async (req, res, next) => {
  await UserSession.findOneAndDelete({ userId: req.user._id });
  res.clearCookie("access_token");
  res.status(200).json({
    status: "success",
    message: "user logout successfully",
  });
});

// Profile
exports.profile = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    status: "success",
    data: user,
    message: "user profile fetched successfully",
  });
});
