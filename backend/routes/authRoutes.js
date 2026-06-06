const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  applyAsProvider,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/apply-provider", protect, applyAsProvider);

module.exports = router;