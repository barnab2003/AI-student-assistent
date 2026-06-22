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

// @route   GET /api/auth/leaderboard
// @desc    Get top 50 users by XP
router.get('/leaderboard', async (req, res) => {
  try {
    // Find all users, sort by XP descending (-1), limit to 50, and only return specific safe fields
    const topUsers = await User.find()
      .sort({ xp: -1 })
      .limit(50)
      .select('username xp level streak profilePicture');
      
    res.json(topUsers);
  } catch (error) {
    console.error("Leaderboard Error:", error);
    res.status(500).json({ message: "Server Error fetching leaderboard" });
  }
});
// Private Diagnostics Path
router.get('/me', protect, getMe);

// @route   POST /api/auth/add-xp
// @desc    Reward a user with XP and handle auto-leveling
router.post('/add-xp', async (req, res) => {
  try {
    const { username, xpToAdd } = req.body;

    // 1. Increment the user's XP directly in the database
    const user = await User.findOneAndUpdate(
      { username: username },
      { $inc: { xp: xpToAdd } },
      { new: true } // This tells MongoDB to return the newly updated user document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Auto-Leveling Logic (1 Level per 100 XP)
    // Example: 250 XP / 100 = 2.5. Math.floor makes it 2. Plus base level 1 = Level 3.
    const calculatedLevel = Math.floor(user.xp / 100) + 1;
    
    // If their new XP pushed them to a new level, update the level field!
    if (user.level !== calculatedLevel) {
      user.level = calculatedLevel;
      await user.save();
    }

    // 3. Send success response back to the Quiz UI
    res.json({ 
      message: "XP added successfully!", 
      xp: user.xp, 
      level: user.level 
    });

  } catch (error) {
    console.error("Add XP Error:", error);
    res.status(500).json({ message: "Server error adding XP" });
  }
});
// @route   PUT /api/auth/profile
// @desc    Update user profile (username & profile picture)
router.put('/profile', async (req, res) => {
  try {
    const { username, profilePicture } = req.body;
    
    // Find the user by the ID attached to the JWT token
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update the fields if they were provided
    if (username) user.username = username;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    // Send back the updated, safe user object
    res.json({
      id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
      level: user.level,
      xp: user.xp,
      streak: user.streak,
      badges: user.badges
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Server error updating profile" });
  }
});
module.exports = router;