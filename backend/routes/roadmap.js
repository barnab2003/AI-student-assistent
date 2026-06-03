const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Roadmap = require('../models/Roadmap');
const User = require('../models/User');

// @route   GET /api/roadmap
// @desc    Get current user's active roadmap
router.get('/', protect, async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ userId: req.user.id });
    if (!roadmap) return res.status(404).json({ message: "No roadmap found for this user." });
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching roadmap." });
  }
});

// @route   POST /api/roadmap/toggle-task
// @desc    Toggle task complete status, award XP, update contribution grid logs
router.post('/toggle-task', protect, async (req, res) => {
  const { taskId, moduleName } = req.body;
  const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

  try {
    const roadmap = await Roadmap.findOne({ userId: req.user.id });
    if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

    let xpReward = 0;
    let targetTask = null;

    // Find the task within the nested subdocument layers
    for (let mod of roadmap.modules) {
      if (mod.moduleName === moduleName) {
        targetTask = mod.tasks.find(t => t.taskId === taskId);
        break;
      }
    }

    if (!targetTask) return res.status(404).json({ message: "Task not found" });

    // Toggle logic
    if (!targetTask.isCompleted) {
      targetTask.isCompleted = true;
      targetTask.completedAt = new Date();
      xpReward = 15; // Award 15 XP upon completion
    } else {
      targetTask.isCompleted = false;
      targetTask.completedAt = null;
      xpReward = -15; // Deduct XP if user unchecked a completed task
    }

    // Update the contribution grid activity log count
    const logIndex = roadmap.dailyActivityLog.findIndex(log => log.date === todayStr);
    if (logIndex > -1) {
      roadmap.dailyActivityLog[logIndex].count = Math.max(0, roadmap.dailyActivityLog[logIndex].count + (xpReward > 0 ? 1 : -1));
    } else if (xpReward > 0) {
      roadmap.dailyActivityLog.push({ date: todayStr, count: 1 });
    }

    await roadmap.save();

    // Dynamically adjust user's overall profile XP and calculate levels
    const user = await User.findById(req.user.id);
    user.xp = Math.max(0, user.xp + xpReward);
    
    // Quick leveling calculation: every 100 XP unlocks a new tier
    user.level = Math.floor(user.xp / 100) + 1; 
    await user.save();

    res.json({ roadmap, user });
  } catch (error) {
    res.status(500).json({ message: "Server error processing task status." });
  }
});

module.exports = router;