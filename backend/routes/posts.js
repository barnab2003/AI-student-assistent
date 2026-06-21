const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Post = require('../models/Post');

// @route   GET /api/posts
// @desc    Get all posts (with infinite scroll pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();
    const hasMore = skip + posts.length < totalPosts;

    res.json({ posts, hasMore, currentPage: page });
  } catch (err) {
    console.error("Fetch Posts Error:", err);
    res.status(500).send('Server Error fetching posts');
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like or unlike a post
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const hasLiked = post.likes.includes(req.user.id);
    if (hasLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error("Like Error:", err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;