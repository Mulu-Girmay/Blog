const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

// REGISTER - PUBLIC (only for guests)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;

    // Check if user exists
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // ✅ IMPORTANT: Force role to 'guest' for public registration
    // Users cannot choose their own role!
    const user = new User({
      username,
      email,
      password,
      role: "guest", // ← ALWAYS guest for public registration
      bio: bio || "Reader",
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "lawblogsecret",
      { expiresIn: "7d" },
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ NEW: Admin-only route to create authors
router.post("/create-author", auth, async (req, res) => {
  try {
    // Only admin can create authors
    if (req.user.role !== "admin") {
      return res.status(403).json({
        error: "Only admins can create author accounts",
      });
    }

    const { username, email, password, bio } = req.body;

    // Check if user exists
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // ✅ Force role to 'author'
    const user = new User({
      username,
      email,
      password,
      role: "author", // ← Always author for this route
      bio: bio || "Guest Author",
    });

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: "Author created successfully!",
      user: userResponse,
      temporaryPassword: password, // Only shown once!
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN - same for everyone
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "lawblogsecret",
      { expiresIn: "7d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET current user (protected)
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// CHANGE PASSWORD (authenticated)
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ✅ UPDATE PROFILE (authenticated)
router.put("/profile", auth, async (req, res) => {
  try {
    const { email, bio, notifications } = req.body;
    const user = await User.findById(req.user.id);

    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;
    if (notifications) {
      user.notifications = {
        ...user.notifications,
        ...notifications,
      };
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
