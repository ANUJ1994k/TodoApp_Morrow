// models/todo.model.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now },
});

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  tag: { type: String },
  mentionedUsers: [String],
  notes: [noteSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);
