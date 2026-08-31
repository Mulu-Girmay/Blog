const Question = require("../models/Question");
const { sendQuestionAnsweredNotification } = require("../services/emailService");

const isAdminOrAuthor = (user) =>
  user.role === "admin" || user.role === "author";

exports.createQuestion = async (req, res) => {
  try {
    const { name, email, subject, question, category } = req.body;
    if (!name || !email || !subject || !question) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newQuestion = await Question.create({
      name,
      email,
      subject,
      question,
      category: category || "General",
    });
    res.status(201).json({
      message: "Your question has been submitted! I'll review it soon.",
      question: newQuestion,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    if (!isAdminOrAuthor(req.user)) {
      return res.status(403).json({ error: "Only admins and authors can view questions" });
    }
    const query = {};
    if (req.query.status === "answered") query.isAnswered = true;
    if (req.query.status === "unanswered") query.isAnswered = false;
    res.json(await Question.find(query).sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyQuestions = async (req, res) => {
  try {
    res.json(await Question.find({ email: req.user.email }).sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    if (!isAdminOrAuthor(req.user)) return res.status(403).json({ error: "Access denied" });
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.answerQuestion = async (req, res) => {
  try {
    if (!isAdminOrAuthor(req.user)) {
      return res.status(403).json({ error: "Only admins and authors can answer questions" });
    }
    const { answer, isPublic } = req.body;
    if (!answer) return res.status(400).json({ error: "Answer is required" });
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });

    question.answer = answer;
    question.isAnswered = true;
    question.answeredBy = req.user.username;
    question.answeredAt = new Date();
    question.isPublic = isPublic !== undefined ? isPublic : true;
    await question.save();

    sendQuestionAnsweredNotification(question, answer).catch((error) => {
      console.error("Failed to send question-answer notification:", error.message);
    });
    res.json({ message: "Question answered successfully.", question });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markConverted = async (req, res) => {
  try {
    if (!isAdminOrAuthor(req.user)) return res.status(403).json({ error: "Access denied" });
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    question.convertedToPost = true;
    question.postSlug = req.body.postSlug || "";
    await question.save();
    res.json({ message: "Question marked as converted to post!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Only admins can delete questions" });
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
