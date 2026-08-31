const Post = require("../models/Post");
const User = require("../models/User");
const slugify = require("slugify");
const { sendNewPostNotification } = require("../services/emailService");
const getPosts = async (req, res) => {
  try {
    const { category, featured, search, limit = 10, page = 1 } = req.query;
    const query = {};

    if (category) query.category = category;
    if (featured === "true") query.featured = true;

    if (search && search.trim()) {
      const searchTerm = search.trim();
      query.$or = [
        { title: { $regex: searchTerm, $options: "i" } },
        { content: { $regex: searchTerm, $options: "i" } },
        { excerpt: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
        { tags: { $regex: searchTerm, $options: "i" } },
        { "author.name": { $regex: searchTerm, $options: "i" } },
      ];
    }

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
};
const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createPost = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "author") {
      return res
        .status(403)
        .json({ error: "Only admins and authors can create posts" });
    }
    const {
      title,
      content,
      excerpt,
      category,
      tags,
      featured,
      plainEnglish,
      image,
    } = req.body;

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
      image: image || "",
      author: {
        name: req.user.username,
        bio: req.user.bio || "",
        avatar: req.user.avatar || "",
      },
      readTime: Math.ceil(content.split(" ").length / 200),
    });

    await post.save();

    res.status(201).json(post);

    User.find({
      "notifications.newPost": true,
      role: { $in: ["guest", "author"] }, // Don't notify admins (they wrote it)
    })
      .select("email")
      .then(
        (subscribers) =>
          subscribers.length && sendNewPostNotification(post, subscribers),
      )
      .catch((emailErr) =>
        console.error(
          "Failed to send new post notifications:",
          emailErr.message,
        ),
      );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updatePost = async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "author") {
      return res
        .status(403)
        .json({ error: "Only admins and authors can update posts" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const {
      title,
      content,
      excerpt,
      category,
      tags,
      featured,
      plainEnglish,
      image,
    } = req.body;

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
    if (image !== undefined) post.image = image;

    post.updatedAt = Date.now();
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deletePost = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Only admins can delete posts" });
    }

    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
