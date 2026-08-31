const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const {
  registerUser,
  createAuthor,
  loginUser,
  currentUser,
  changePassword,
  updateProfile,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/create-author", auth, createAuthor);
router.post("/login", loginUser);
router.get("/me", auth, currentUser);
router.put("/change-password", auth, changePassword);
router.put("/profile", auth, updateProfile);
module.exports = router;
