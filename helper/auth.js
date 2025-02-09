import { verifyToken } from "../utils/jwt";

/**
 * Middleware to authenticate users via JWT.
 */
export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract Bearer token
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }
    const decoded = await verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded; // Attach user data to request
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ message: "Error authenticating user" });
  }
};
