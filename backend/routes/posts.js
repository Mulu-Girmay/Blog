const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const slugify = require("slugify");
const { sendNewPostNotification } = require("../services/emailService");
const User = require("../models/user");

// GET all posts (public)
router.get("/", async (req, res) => {
  try {
    const { category, featured, limit = 10, page = 1 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (featured === "true") query.featured = true;

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single post by slug (public)
router.get("/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE post (admin/author only)
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, featured, plainEnglish } =
      req.body;

    if (!title || !content || !excerpt) {
      return res
        .status(400)
        .json({ error: "Title, content, and excerpt are required" });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const existing = await Post.findOne({ slug });
    if (existing) {
      return res
        .status(400)
        .json({ error: "A post with this title already exists" });
    }

    const post = new Post({
      title,
      slug,
      content,
      excerpt,
      category: category || "General Legal Articles",
      tags: tags || [],
      featured: featured || false,
      plainEnglish: plainEnglish || "",
      author: {
        name: req.user.username,
        bio: req.user.bio || "",
        avatar: req.user.avatar || "",
      },
      readTime: Math.ceil(content.split(" ").length / 200),
    });

    await post.save();

    // ✅ Send email notification to subscribers
    try {
      // Get all users who opted in for new post notifications
      const subscribers = await User.find({
        "notifications.newPost": true,
        role: { $in: ["guest", "author"] }, // Don't notify admins (they wrote it)
      }).select("email");

      if (subscribers.length > 0) {
        await sendNewPostNotification(post, subscribers);
        console.log(
          `📧 New post notification sent to ${subscribers.length} subscribers`,
        );
      }
    } catch (emailErr) {
      console.error(
        "❌ Failed to send new post notifications:",
        emailErr.message,
      );
      // Don't fail the request if email fails
    }

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE post (admin/author only)
router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const { title, content, excerpt, category, tags, featured, plainEnglish } =
      req.body;

    if (title) {
      post.title = title;
      post.slug = slugify(title, { lower: true, strict: true });
    }
    if (content) {
      post.content = content;
      post.readTime = Math.ceil(content.split(" ").length / 200);
    }
    if (excerpt) post.excerpt = excerpt;
    if (category) post.category = category;
    if (tags) post.tags = tags;
    if (featured !== undefined) post.featured = featured;
    if (plainEnglish !== undefined) post.plainEnglish = plainEnglish;

    post.updatedAt = Date.now();
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE post (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    // Only admin can delete
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can delete posts" });
    }

    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// CREATE post (admin/author only)
router.post("/", auth, async (req, res) => {
  try {
    // ✅ Check if user is admin or author
    if (req.user.role !== "admin" && req.user.role !== "author") {
      return res
        .status(403)
        .json({ error: "Only admins and authors can create posts" });
    }

    // ... rest of the code
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
