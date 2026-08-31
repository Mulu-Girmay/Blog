const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can view users" });
    }

    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id/role", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can change roles" });
    }

    const { role } = req.body;
    if (!["admin", "author", "guest"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    if (role !== "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      const targetUser = await User.findById(req.params.id);
      if (targetUser.role === "admin" && adminCount <= 1) {
        return res.status(400).json({
          error: "Cannot demote the only admin user",
        });
      }
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can delete users" });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }
    const targetUser = await User.findById(req.params.id);
    if (targetUser.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({
          error: "Cannot delete the only admin user",
        });
      }
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
