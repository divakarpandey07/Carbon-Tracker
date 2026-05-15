const Order = require("../models/Order");
const OffsetListing = require("../models/OffsetListing");
const crypto = require("crypto");

// @desc    Create a pending order for a listing
// @route   POST /api/checkout/create-order
// @access  Private (user)
const createOrder = async (req, res) => {
  try {
    const { listingId, quantity } = req.body;

    if (!listingId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "listingId and a valid quantity are required" });
    }

    const listing = await OffsetListing.findById(listingId);

    if (!listing || !listing.isActive) {
      return res.status(404).json({ message: "Listing not found or inactive" });
    }

    if (listing.availableQuantity < quantity) {
      return res.status(400).json({ message: "Requested quantity exceeds available offset units" });
    }

    const totalAmount = Math.round(listing.pricePerUnit * quantity * 100) / 100;

    const order = await Order.create({
      user: req.user._id,
      listing: listing._id,
      provider: listing.provider,
      quantity,
      pricePerUnit: listing.pricePerUnit,
      totalAmount,
      status: "pending",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm/simulate payment success for an order
// @route   POST /api/checkout/confirm/:orderId
// @access  Private (user, owner)
const confirmPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to confirm this order" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: `Order is already ${order.status}, cannot confirm again` });
    }

    // Simulate payment gateway transaction reference
    const transactionRef = "TXN-" + crypto.randomBytes(8).toString("hex").toUpperCase();

    order.status = "paid";
    order.transactionRef = transactionRef;
    order.paidAt = new Date();
    await order.save();

    // Reduce available quantity on the listing
    const listing = await OffsetListing.findById(order.listing);
    if (listing) {
      listing.availableQuantity = Math.max(0, listing.availableQuantity - order.quantity);
      await listing.save();
    }

    res.status(200).json({ message: "Payment confirmed successfully", order });
  } catch (error) {
    console.error("CONFIRM PAYMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's order history
// @route   GET /api/checkout/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("listing", "title offsetType")
      .populate("provider", "name organization")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order details
// @route   GET /api/checkout/:orderId
// @access  Private (owner) or Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("listing", "title offsetType")
      .populate("provider", "name organization")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const isOwner = order.user._id.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("GET ORDER BY ID ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a pending order
// @route   POST /api/checkout/:orderId/cancel
// @access  Private (owner)
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: `Cannot cancel an order that is already ${order.status}` });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled", order });
  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  confirmPayment,
  getMyOrders,
  getOrderById,
  cancelOrder,
};