const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const authRateLimit = require("../middleware/authRateLimit");
const {
  registerUser,
  createAuthor,
  loginUser,
  currentUser,
  changePassword,
  updateProfile,
} = require("../controllers/authController");

router.post("/register", authRateLimit, registerUser);
router.post("/create-author", auth, createAuthor);
router.post("/login", authRateLimit, loginUser);
router.get("/me", auth, currentUser);
router.put("/change-password", auth, changePassword);
router.put("/profile", auth, updateProfile);
module.exports = router;
