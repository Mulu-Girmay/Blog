const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const auth = require("../middleware/auth");

// ✅ PUBLIC: Submit a question
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, question, category } = req.body;

    if (!name || !email || !subject || !question) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newQuestion = new Question({
      name,
      email,
      subject,
      question,
      category: category || "General",
    });

    await newQuestion.save();
    res.status(201).json({
      message: "✅ Your question has been submitted! I'll review it soon.",
      question: newQuestion,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADMIN: Get all questions
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "author") {
      return res
        .status(403)
        .json({ error: "Only admins and authors can view questions" });
    }

    const { status } = req.query;
    const query = {};
    if (status === "answered") query.isAnswered = true;
    if (status === "unanswered") query.isAnswered = false;

    const questions = await Question.find(query).sort({ createdAt: -1 });

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADMIN: Get single question
router.get("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "author") {
      return res.status(403).json({ error: "Access denied" });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADMIN: Answer a question
router.put("/:id/answer", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "author") {
      return res
        .status(403)
        .json({ error: "Only admins and authors can answer questions" });
    }

    const { answer, isPublic } = req.body;
    if (!answer) {
      return res.status(400).json({ error: "Answer is required" });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    question.answer = answer;
    question.isAnswered = true;
    question.answeredBy = req.user.username;
    question.answeredAt = new Date();
    question.isPublic = isPublic !== undefined ? isPublic : true;

    await question.save();

    res.json({
      message: "✅ Question answered successfully!",
      question,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADMIN: Mark question as converted to post
router.put("/:id/converted", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "author") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { postSlug } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    question.convertedToPost = true;
    question.postSlug = postSlug || "";

    await question.save();

    res.json({ message: "✅ Question marked as converted to post!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ ADMIN: Delete question
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Only admins can delete questions" });
    }

    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
