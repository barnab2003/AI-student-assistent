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
      userProfilePicture: user.profilePicture,
      text, mediaUrl, linkUrl
    });
    
    // NEW: Broadcast the new post to all connected clients instantly
    req.io.emit('receive_new_post', newPost);
    
    res.status(201).json(newPost);
  } catch (error) { res.status(500).json({ message: "Error creating post." }); }
});

// @route   POST /api/community/comment/:postId
// @desc    Add a comment to a post
router.post('/comment/:postId', protect, async (req, res) => {
  const { text } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = { userId: user._id, username: user.username, text };
    post.comments.push(newComment);
    await post.save();

    // NEW: Broadcast the updated post (with the new comment) to everyone
    req.io.emit('receive_new_comment', post);

    res.status(201).json(post);
  } catch (error) { res.status(500).json({ message: "Error posting comment." }); }
});
// @route   DELETE /api/community/post/:id
// @desc    Delete a post
router.delete('/post/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check authorization: Only the author can delete
    if (post.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await post.deleteOne();
    
    // Broadcast the deletion globally
    req.io.emit('post_deleted', req.params.id);
    
    res.json({ message: "Post removed" });
  } catch (error) { res.status(500).json({ message: "Error deleting post." }); }
});

// @route   PUT /api/community/post/:id
// @desc    Edit a post
router.put('/post/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    post.text = req.body.text || post.text;
    await post.save();

    // Broadcast the update globally
    req.io.emit('post_updated', post);

    res.json(post);
  } catch (error) { res.status(500).json({ message: "Error updating post." }); }
});
module.exports = router;