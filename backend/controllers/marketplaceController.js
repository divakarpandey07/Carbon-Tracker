const OffsetListing = require("../models/OffsetListing");

// @desc    Create a new offset listing
// @route   POST /api/marketplace
// @access  Verified Provider only
const createListing = async (req, res) => {
  try {
    const { title, description, offsetType, pricePerUnit, availableQuantity, location, imageUrl } = req.body;

    if (!title || !description || !offsetType || pricePerUnit === undefined || availableQuantity === undefined) {
      return res.status(400).json({
        message: "title, description, offsetType, pricePerUnit, availableQuantity are required",
      });
    }

    const listing = await OffsetListing.create({
      provider: req.user._id,
      title,
      description,
      offsetType,
      pricePerUnit,
      availableQuantity,
      location,
      imageUrl,
    });

    res.status(201).json(listing);
  } catch (error) {
    console.error("CREATE LISTING ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Browse all active listings (with filters)
// @route   GET /api/marketplace?offsetType=&minPrice=&maxPrice=&search=&page=&limit=
// @access  Private (any logged-in user)
const getListings = async (req, res) => {
  try {
    const { offsetType, minPrice, maxPrice, search, page = 1, limit = 12 } = req.query;

    const query = { isActive: true };

    if (offsetType) query.offsetType = offsetType;

    if (minPrice || maxPrice) {
      query.pricePerUnit = {};
      if (minPrice) query.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) query.pricePerUnit.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [listings, total] = await Promise.all([
      OffsetListing.find(query)
        .populate("provider", "name email organization")
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      OffsetListing.countDocuments(query),
    ]);

    res.status(200).json({
      listings,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("GET LISTINGS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single listing details
// @route   GET /api/marketplace/:id
// @access  Private
const getListingById = async (req, res) => {
  try {
    const listing = await OffsetListing.findById(req.params.id).populate(
      "provider",
      "name email organization"
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (error) {
    console.error("GET LISTING BY ID ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update own listing
// @route   PUT /api/marketplace/:id
// @access  Provider (owner only)
const updateListing = async (req, res) => {
  try {
    const listing = await OffsetListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this listing" });
    }

    const { title, description, offsetType, pricePerUnit, availableQuantity, location, imageUrl, isActive } = req.body;

    listing.title = title ?? listing.title;
    listing.description = description ?? listing.description;
    listing.offsetType = offsetType ?? listing.offsetType;
    listing.pricePerUnit = pricePerUnit ?? listing.pricePerUnit;
    listing.availableQuantity = availableQuantity ?? listing.availableQuantity;
    listing.location = location ?? listing.location;
    listing.imageUrl = imageUrl ?? listing.imageUrl;
    listing.isActive = isActive ?? listing.isActive;

    await listing.save();

    res.status(200).json(listing);
  } catch (error) {
    console.error("UPDATE LISTING ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete (deactivate) own listing
// @route   DELETE /api/marketplace/:id
// @access  Provider (owner only)
const deleteListing = async (req, res) => {
  try {
    const listing = await OffsetListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    await listing.deleteOne();

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("DELETE LISTING ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all listings created by the logged-in provider
// @route   GET /api/marketplace/my-listings
// @access  Provider
const getMyListings = async (req, res) => {
  try {
    const listings = await OffsetListing.find({ provider: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    console.error("GET MY LISTINGS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  getMyListings,
};