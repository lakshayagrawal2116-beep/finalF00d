import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  try {
    // ✅ Get token
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user from DB
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // 🔥 SINGLE LOGIN CHECK
    if (user.activeToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again."
      });
    }

    // ✅ Attach user to request
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }
};

export default authMiddleware;
