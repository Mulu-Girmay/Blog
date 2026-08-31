const express = require("express");
const auth = require("../middleware/auth");
const questionController = require("../controllers/questionController");

const router = express.Router();

router.post("/", questionController.createQuestion);
router.get("/", auth, questionController.getQuestions);
router.get("/user/my-questions", auth, questionController.getMyQuestions);
router.get("/:id", auth, questionController.getQuestion);
router.put("/:id/answer", auth, questionController.answerQuestion);
router.put("/:id/converted", auth, questionController.markConverted);
router.delete("/:id", auth, questionController.deleteQuestion);

module.exports = router;
