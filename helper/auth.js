const UserSession = require("../model/user_session.model");
const AppError = require("../utils/AppError");
const { verifyToken } = require("../utils/jwt");

/**
 * Middleware to authenticate users via JWT.
 */
const WHITELISTED_ROUTES = ["/auth/login", "/auth/register"];

exports.authenticateUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (WHITELISTED_ROUTES.includes(req.path)) {
      return next(); // Skip authentication for these routes
    }
    if (!authorization) {
      return next(new AppError("Unauthorized", 401));
    }
    const token = authorization.replace(/Bearer\s*"?([^"]+)"?/, "$1");

    const isTokenExist = await verifyToken(token);
    if (!isTokenExist) {
      return next(new AppError("Unauthorized", 401));
    }
    const user = await UserSession.findOne({ token });
    if (!user) {
      return next(new AppError("Unauthorized user", 401));
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized: Token expired" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    next(new AppError(error.message, 500));
  }
};
