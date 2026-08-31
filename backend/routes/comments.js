const express = require("express");
const auth = require("../middleware/auth");
const commentController = require("../controllers/commentController");

const router = express.Router();

router.get("/post/:postId", commentController.getPostComments);
router.post("/", auth, commentController.createComment);
router.post("/:id/react", auth, commentController.toggleReaction);
router.post("/react/:id", auth, commentController.toggleReaction);
router.delete("/:id", auth, commentController.deleteComment);

module.exports = router;
