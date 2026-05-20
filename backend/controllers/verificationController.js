const ProviderApplication = require("../models/ProviderApplication");
const User = require("../models/User");

const applyForProvider = async (req, res) => {
  try {
    const { organizationName, registrationNumber, website, description, documentUrl } = req.body;

    if (!organizationName || !description) {
      return res.status(400).json({ message: "organizationName and description are required" });
    }

    if (req.user.role !== "user") {
      return res.status(400).json({ message: "Only regular users can apply to become providers" });
    }

    const existing = await ProviderApplication.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({
        message: `You already have an application with status: ${existing.status}`,
      });
    }

    const application = await ProviderApplication.create({
      user: req.user._id,
      organizationName,
      registrationNumber,
      website,
      description,
      documentUrl,
    });

    await User.findByIdAndUpdate(req.user._id, { providerStatus: "pending" });

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error("APPLY PROVIDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const getPendingApplications = async (req, res) => {
  try {
    const applications = await ProviderApplication.find({ status: "pending" })
      .populate("user", "name email createdAt")
      .sort({ createdAt: 1 });

    res.status(200).json(applications);
  } catch (error) {
    console.error("GET PENDING ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const getApplicationByUserId = async (req, res) => {
  try {
    const application = await ProviderApplication.findOne({ user: req.params.userId }).populate(
      "user",
      "name email createdAt"
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error("GET APPLICATION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const approveApplication = async (req, res) => {
  try {
    const application = await ProviderApplication.findOne({ user: req.params.userId });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== "pending") {
      return res.status(400).json({ message: `Application is already ${application.status}` });
    }

    application.status = "approved";
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    await application.save();

    await User.findByIdAndUpdate(req.params.userId, {
      role: "provider",
      providerStatus: "verified",
    });

    res.status(200).json({ message: "Application approved", application });
  } catch (error) {
    console.error("APPROVE APPLICATION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const rejectApplication = async (req, res) => {
  try {
    const { reason } = req.body;

    const application = await ProviderApplication.findOne({ user: req.params.userId });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== "pending") {
      return res.status(400).json({ message: `Application is already ${application.status}` });
    }

    application.status = "rejected";
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    application.rejectionReason = reason || "Not specified";
    await application.save();

    await User.findByIdAndUpdate(req.params.userId, { providerStatus: "rejected" });

    res.status(200).json({ message: "Application rejected", application });
  } catch (error) {
    console.error("REJECT APPLICATION ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyForProvider,
  getPendingApplications,
  getApplicationByUserId,
  approveApplication,
  rejectApplication,
};