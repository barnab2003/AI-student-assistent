const User = require('../models/User');
const Roadmap = require('../models/Roadmap');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new student & seed a dummy roadmap
// @route   POST /api/auth/register
exports.registerStudent = async (req, res) => {
  const { username, email, password, chosenTrack } = req.body;

  try {
    // 1. Validation checks
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please enter all required fields.' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Username or Email already registered.' });
    }

    // 2. Hash the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the student profile
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      lastActive: new Date()
    });

    // 4. Phase 1 Mock Data Seeding: Generate a hardcoded roadmap based on track selection
    const trackName = chosenTrack || 'Web Development';
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setDate(today.getDate() + 30);

    const sampleModules = [
      {
        moduleName: "Frontend Core Fundamentals",
        tasks: [
          { taskId: "task_1", title: "Master HTML5 Semantic Layouts", dueDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000) }, // 2 days out
          { taskId: "task_2", title: "Learn CSS Grid & Flexbox Layouts", dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000) }, // 5 days out
          { taskId: "task_3", title: "Understand JavaScript Async/Await & Promises", dueDate: new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000) }
        ]
      },
      {
        moduleName: "Backend & Server Operations",
        tasks: [
          { taskId: "task_4", title: "Build an Express.js Server Framework", dueDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000) },
          { taskId: "task_5", title: "Design MongoDB Aggregations & Models", dueDate: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000) }
        ]
      }
    ];

    await Roadmap.create({
      userId: newUser._id,
      track: trackName,
      startDate: today,
      endDate: oneMonthFromNow,
      modules: sampleModules,
      dailyActivityLog: [] // Empty to begin with
    });

    // 5. Send back auth token and basic payload
    res.status(201).json({
      token: generateToken(newUser._id),
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        xp: newUser.xp,
        level: newUser.level,
        streak: newUser.streak
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Registration failed due to a server error.' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Update login timestamp for streak parsing later
    user.lastActive = new Date();
    await user.save();

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Login failed due to a server error.' });
  }
};

// @desc    Get user data profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user data.' });
  }
};