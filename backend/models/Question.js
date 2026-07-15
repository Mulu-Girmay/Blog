const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    default: "General",
  },
  isAnswered: {
    type: Boolean,
    default: false,
  },
  isPublic: {
    type: Boolean,
    default: true, // Whether to show on the "Answered Questions" page
  },
  answer: {
    type: String,
    default: "",
  },
  answeredBy: {
    type: String,
    default: "",
  },
  answeredAt: {
    type: Date,
  },
  convertedToPost: {
    type: Boolean,
    default: false,
  },
  postSlug: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
