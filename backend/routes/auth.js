const express = require('express');
const router = express.Router();
const { registerStudent, loginStudent, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const Post = require('../models/Post'); // Add this near your other imports
const User = require('../models/User'); // <--- ADD THIS EXACT LINE
// Public Onboarding Paths
router.post('/register', registerStudent);
router.post('/login', loginStudent);
// @route   PUT /api/auth/profile
// @desc    Update username and profile picture
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, profilePicture } = req.body;
    const user = await User.findById(req.user.id);
    
    if (username) user.username = username;
    if (profilePicture) user.profilePicture = profilePicture;
    
    await user.save();

    // Update all their existing posts with the new username
    await Post.updateMany(
      { userId: user._id },
      { $set: { username: user.username, userProfilePicture: user.profilePicture } }
    );

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error("🔥 BACKEND CRASH REASON:", error); // This prints the true error to your backend terminal
    res.status(500).json({ message: error.message }); // This sends the true error to your React popup
  }
});
// Private Diagnostics Path
router.get('/me', protect, getMe);

module.exports = router;