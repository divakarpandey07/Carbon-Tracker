const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - verifies token
const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.toLowerCase().startsWith("bearer")) {
    try {
      const parts = authHeader.split(" ");
      token = parts[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_super_secret_key_change_this");

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };