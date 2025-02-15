const { AUTHENTICATION_TYPE } = require("../constant/authentication");
const User = require("../model/user.model");
const UserSession = require("../model/user_session.model");
const AppError = require("../utils/AppError");
const CatchAsync = require("../utils/CatchAsync");
const { generatePassword64 } = require("../utils/common");
const { hashPassword, comparePassword } = require("../utils/hashing");
const { generateToken } = require("../utils/jwt");

const proccedToLgoin = async (user, res, next) => {
  // signed jwt token
  try {
    const jwt = await generateToken({
      _id: user.id,
      role: user.role,
      name: user.name,
      authentication_type: user.authentication_type,
    });

    //   store user seesion
    await UserSession.findByIdAndUpdate(
      { _id: user._id },
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

    return res.status(200).json({
      status: "success",
      data: { user, token: jwt },
      message: "user login successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 500));
  }
};

// @Google authentication and gerate jwt token
const googleAuthentication = async (req, res, next) => {
  try {
    const {
      name,
      email,
      role = "user",
      authentication_type,
      password = generatePassword64(),
    } = req.body;
    const hashedPassword = await hashPassword(password);
    let user = await User.findOne({
      email,
    });
    if (!user) {
      user = await User.create({
        name,
        email,
        role,
        password: hashedPassword,
        authentication_type: authentication_type,
        active_subscription: true,
        total_credit: 300,
        used_credit: 0,
        remaining_credit: 300,
      });
    }
    return await proccedToLgoin(user, res, next);
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.register = CatchAsync(async (req, res, next) => {
  if (!req.body) return next(new AppError("request body is required", 404));
  const {
    name,
    email,
    password = generatePassword64(),
    role,
    authentication_type = AUTHENTICATION_TYPE.EMAIL,
  } = req.body;
  if (!name || !email || !password) {
    return next(new AppError("name, email and password are required", 404));
  }
  if (!role) {
    return next(new AppError("role is required", 404));
  }

  // @Define user auth based on authentication type
  if (AUTHENTICATION_TYPE.GOOGLE == authentication_type) {
    return await googleAuthentication(req, res, next);
  }
  const checkUser = await User.findOne({ email: email });
  if (checkUser) {
    return next(new AppError("user already exist", 404));
  }
  // @register
  const hashedPassword = await hashPassword(password);
  await User.create({
    email,
    password: hashedPassword,
    name,
    role,
    authentication_type,
    active_subscription: true,
    total_credit: 300,
    used_credit: 0,
    remaining_credit: 300,
  });

  res.status(200).json({
    status: "success",
    message: "user created successfully",
  });
});

exports.login = CatchAsync(async (req, res, next) => {
  if (!req.body) return next(new AppError("request body is required", 404));
  const {
    email,
    password = generatePassword64(),
    authentication_type,
  } = req.body;
  if (!email || !password) {
    return next(new AppError("email and password are required", 404));
  }
  if (AUTHENTICATION_TYPE.GOOGLE == authentication_type) {
    return await googleAuthentication(req, res, next);
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("user not found", 404));
  }

  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError("password is incorrect", 404));
  }

  // Proceed to login
  return await proccedToLgoin(user, res, next);
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
