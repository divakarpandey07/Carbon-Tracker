const Post = require("../models/Post");

// @desc    Create a new post
// @route   POST /api/feed
// @access  Private (user)
const createPost = async (req, res) => {
  try {
    const { content, postType, relatedChallenge, imageUrl } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const post = await Post.create({
      user: req.user._id,
      content,
      postType,
      relatedChallenge,
      imageUrl,
    });

    const populatedPost = await Post.findById(post._id).populate("user", "name organization");

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get feed (paginated)
// @route   GET /api/feed?page=&limit=
// @access  Private
const getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [posts, total] = await Promise.all([
      Post.find()
        .populate("user", "name organization")
        .populate("comments.user", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Post.countDocuments(),
    ]);

    res.status(200).json({
      posts,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("GET FEED ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like/unlike a post (toggle)
// @route   POST /api/feed/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes.some((id) => id.toString() === req.user._id.toString());

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("TOGGLE LIKE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a comment to a post
// @route   POST /api/feed/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({ user: req.user._id, text });
    await post.save();

    const updatedPost = await Post.findById(post._id).populate("comments.user", "name");

    res.status(201).json({
      message: "Comment added",
      comments: updatedPost.comments,
    });
  } catch (error) {
    console.error("ADD COMMENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete own post
// @route   DELETE /api/feed/:id
// @access  Private (owner) or Admin
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isOwner = post.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("DELETE POST ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPost, getFeed, toggleLike, addComment, deletePost };