const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  taskId: { type: String, required: true },
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date, default: null }
});

const ModuleSchema = new mongoose.Schema({
  moduleName: { type: String, required: true },
  tasks: [TaskSchema]
});

const ActivityLogSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format: "YYYY-MM-DD"
  count: { type: Number, default: 0 }
});

const RoadmapSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  track: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  modules: [ModuleSchema],
  dailyActivityLog: [ActivityLogSchema]
}, { timestamps: true });

module.exports = mongoose.model('Roadmap', RoadmapSchema);