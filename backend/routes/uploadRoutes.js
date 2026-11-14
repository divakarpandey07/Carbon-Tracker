const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const {
  uploadFile,
  analyzeCarbonFile,
  getSampleTemplate,
} = require("../controllers/uploadController");

// Download sample template (public)
router.get("/template", getSampleTemplate);

// Upload generic file (protected)
router.post("/file", protect, upload.single("file"), uploadFile);

// Upload & analyze file for carbon emissions (protected)
router.post("/analyze-carbon", protect, upload.single("file"), analyzeCarbonFile);

module.exports = router;
