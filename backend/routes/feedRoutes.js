const express = require("express");
const router = express.Router();
const { createPost, getFeed, toggleLike, addComment, deletePost } = require("../controllers/feedController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .post(protect, createPost)
  .get(protect, getFeed);

router.post("/:id/like", protect, toggleLike);
router.post("/:id/comment", protect, addComment);
router.delete("/:id", protect, deletePost);

module.exports = router;