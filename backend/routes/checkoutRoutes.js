const express = require("express");
const router = express.Router();
const {
  createOrder,
  confirmPayment,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/checkoutController");
const { protect } = require("../middleware/authMiddleware");

router.get("/my-orders", protect, getMyOrders);
router.post("/create-order", protect, createOrder);
router.post("/confirm/:orderId", protect, confirmPayment);
router.post("/:orderId/cancel", protect, cancelOrder);
router.get("/:orderId", protect, getOrderById);

module.exports = router;