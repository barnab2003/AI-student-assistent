const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Post = require('../models/Post');
const User = require('../models/User');

// @route   GET /api/community
// @desc    Get all posts ordered by newest first
router.get('/', protect, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching community feed." });
  }
});

// @route   POST /api/community/post
// @desc    Create a new post
router.post('/post', protect, async (req, res) => {
  const { text, mediaUrl, linkUrl } = req.body;
  try {
    const user = await User.findById(req.user.id);
    
    const newPost = await Post.create({
      userId: user._id,
      username: user.username,
      userLevel: user.level,
      text,
      mediaUrl,
      linkUrl
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: "Error creating post." });
  }
});

// @route   POST /api/community/comment/:postId
// @desc    Add a comment to a post
router.post('/comment/:postId', protect, async (req, res) => {
  const { text } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const post = await Post.findById(req.params.postId);
    
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({
      userId: user._id,
      username: user.username,
      text
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error posting comment." });
  }
});

module.exports = router;