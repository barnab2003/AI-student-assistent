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
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   POST /api/roadmap/generate
// @desc    Generate a dynamic AI roadmap and save it to the database
router.post('/generate', protect, async (req, res) => {
  const { track, daysToComplete } = req.body;
  const userId = req.user.id;

  if (!track || !daysToComplete) {
    return res.status(400).json({ message: "Please provide a track and timeframe." });
  }

  try {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + parseInt(daysToComplete));

    // 1. Construct the System Prompt
    // We explicitly tell Gemini the exact JSON structure it MUST return.
    const prompt = `
      You are an expert Computer Science tutor. Create a highly structured learning roadmap for a student who wants to learn "${track}" in exactly ${daysToComplete} days.
      The current start date is ${today.toISOString().split('T')[0]}.
      Distribute the workload logically across the timeframe.

      CRITICAL REQUIREMENT: For every single task, you MUST provide 1 to 2 high-quality, real, and active online learning resources. 
      These can include official documentation, highly rated YouTube playlists, or free interactive tutorials (like MDN, freeCodeCamp, GeeksforGeeks, or W3Schools). Ensure the URLs are valid and directly related to the task topic.

      Return ONLY a raw JSON array. Do not include markdown formatting or backticks.
  
      The JSON array must exactly match this structure:
      [
        {
          "moduleName": "Name of the Module",
          "tasks": [
            {
              "taskId": "a_unique_string_id",
              "title": "Specific actionable task",
              "dueDate": "YYYY-MM-DDT00:00:00.000Z",
              "resources": [
                {
                  "label": "Source Label (e.g., YouTube Playlist, Official Docs)",
                  "url": "https://example.com/actual-learning-link"
                }
              ]
            }
          ]
        }
      ]
      `;
    // 2. Call the Gemini API natively enforcing JSON output
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    let result;
    let maxRetries = 3;
    let delay = 2000; // Start with a 2-second delay

    for (let i = 0; i < maxRetries; i++) {
      try {
        // Attempt the API call
        result = await model.generateContent(prompt);
        break; // If successful, break out of the retry loop instantly
      } catch (err) {
        // If it's a 503 Service Unavailable, and we still have retries left
        if (err.message.includes('503') && i < maxRetries - 1) {
          console.log(`⚠️ Gemini API busy. Retrying in ${delay / 1000} seconds... (Attempt ${i + 1} of ${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Double the wait time for the next attempt (Exponential Backoff)
        } else {
          // If it's a different error (like a 404), or we ran out of retries, throw it to the main catch block
          throw err;
        }
      }
    }

    let generatedJSON = result.response.text();
    generatedJSON = generatedJSON.replace(/```json/g, '').replace(/```/g, '').trim();
    const modules = JSON.parse(generatedJSON);

    // 3. Update or Replace the User's Roadmap in MongoDB
    // If they already have a roadmap, we overwrite it. If not, we create it.
    let roadmap = await Roadmap.findOne({ userId });

    if (roadmap) {
      roadmap.track = track;
      roadmap.startDate = today;
      roadmap.endDate = endDate;
      roadmap.modules = modules;
      roadmap.dailyActivityLog = []; // Reset activity grid for the new track
      await roadmap.save();
    } else {
      roadmap = await Roadmap.create({
        userId,
        track,
        startDate: today,
        endDate: endDate,
        modules,
        dailyActivityLog: []
      });
    }

    res.status(201).json(roadmap);

  } catch (error) {
    console.error("🔥 Detailed Backend Error:", error.message);
    // 1. Check if the error came specifically from the Google Generative AI API
    if (error.status === 503 || (error.message && error.message.includes('503'))) {
      // Forward the 503 status explicitly to the frontend!
      return res.status(503).json({ message: "AI API is busy. Please try again." });
    }
    res.status(500).json({ message: "Failed to generate AI roadmap." });
  }
});

// @route   POST /api/roadmap/recalculate
// @desc    Reschedule incomplete tasks starting from today
router.post('/recalculate', protect, async (req, res) => {
  const { newDaysToComplete } = req.body;
  const userId = req.user.id;

  if (!newDaysToComplete) {
    return res.status(400).json({ message: "Please provide the new timeframe." });
  }

  try {
    const roadmap = await Roadmap.findOne({ userId });
    if (!roadmap || roadmap.modules.length === 0) {
      return res.status(404).json({ message: "No active roadmap found to reschedule." });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Construct the Adaptive Prompt
    const prompt = `
      You are an expert AI tutor. A student is learning "${roadmap.track}". 
      They have fallen behind on their schedule. Today's date is ${todayStr}.
      
      Here is their current roadmap JSON:
      ${JSON.stringify(roadmap.modules)}
      
      Your task:
      1. Leave all tasks where "isCompleted" is true EXACTLY as they are. Do not change their dates.
      2. For all tasks where "isCompleted" is false, reschedule their "dueDate" logically. 
      3. The new schedule for incomplete tasks must start from ${todayStr} and span across the next ${newDaysToComplete} days.
      4. Maintain the exact same JSON structure (an array of modules containing tasks).
      
      Return ONLY the raw JSON array. No markdown, no backticks.
    `;

    // 2. Setup the Model (Using 3.5 Flash for speed)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    // 3. The Exponential Backoff Retry Loop
    let result;
    let maxRetries = 3;
    let delay = 2000;

    for (let i = 0; i < maxRetries; i++) {
      try {
        result = await model.generateContent(prompt);
        break; 
      } catch (err) {
        if (err.message.includes('503') && i < maxRetries - 1) {
          console.log(`⚠️ Gemini API busy. Retrying recalculation in ${delay / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; 
        } else {
          throw err;
        }
      }
    }

    let generatedJSON = result.response.text();
    generatedJSON = generatedJSON.replace(/```json/g, '').replace(/```/g, '').trim();
    const updatedModules = JSON.parse(generatedJSON);

    // 4. Save the updated roadmap back to MongoDB
    roadmap.modules = updatedModules;
    // Optionally update the endDate based on the new timeframe
    const newEndDate = new Date();
    newEndDate.setDate(newEndDate.getDate() + parseInt(newDaysToComplete));
    roadmap.endDate = newEndDate;
    
    await roadmap.save();

    res.status(200).json(roadmap);

  } catch (error) {
    console.error("🔥 Recalculation Error:", error.message);
    res.status(500).json({ message: "Failed to recalculate roadmap." });
  }
});

// @route   POST /api/roadmap/generate-quiz
// @desc    Generate a 3-question AI quiz
router.post('/generate-quiz', async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `
      You are an expert computer science tutor. 
      Create a 3-question multiple-choice quiz about "${topic}".
      Return ONLY a strict JSON array of 3 objects. 
      Do not wrap it in markdown blockquotes like \`\`\`json. 
      Format exactly like this:
      [
        {
          "question": "What does HTML stand for?",
          "options": ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Tool Multi Language"],
          "correctAnswer": "Hyper Text Markup Language"
        }
      ]
    `;

    // 🐛 FIX 1: Initialize the Gemini model here!
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    // Execute AI Call
    const result = await model.generateContent(prompt);
    let rawText = result.response.text();
    
    // Clean up any stray markdown formatting
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    const quizJSON = JSON.parse(rawText);
    
    res.json({ quiz: quizJSON });

  } catch (error) {
    console.error("Quiz Gen Error:", error);
    res.status(500).json({ error: "Failed to generate quiz." });
  }
});

module.exports = router;