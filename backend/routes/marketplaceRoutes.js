const express = require("express");
const router = express.Router();
const {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  getMyListings,
} = require("../controllers/marketplaceController");
const { protect } = require("../middleware/authMiddleware");
const { requireVerifiedProvider } = require("../middleware/providerMiddleware");

// Specific routes before dynamic :id routes
router.get("/my-listings", protect, requireVerifiedProvider, getMyListings);

router.route("/")
  .post(protect, requireVerifiedProvider, createListing)
  .get(protect, getListings);

router.route("/:id")
  .get(protect, getListingById)
  .put(protect, requireVerifiedProvider, updateListing)
  .delete(protect, requireVerifiedProvider, deleteListing);

module.exports = router;