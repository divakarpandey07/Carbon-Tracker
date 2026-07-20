const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "your_super_secret_key_change_this", {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

module.exports = generateToken;