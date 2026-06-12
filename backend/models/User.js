const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastLogin: { type: Date, default: null },
  // NEW: Profile Picture field
  profilePicture: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);