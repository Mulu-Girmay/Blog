const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const uploadsPath = path.join(__dirname, "uploads");

fs.mkdirSync(uploadsPath, { recursive: true });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsPath));

const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lawblog";

// Log which database we're connecting to (credentials redacted) so a
// mismatched .env location or wrong URI is obvious at a glance.
console.log(
  "🔌 Connecting to MongoDB:",
  mongoUri.replace(/\/\/[^@]+@/, "//<credentials>@"),
);

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.log("❌ Database error:", err));

app.use("/api/posts", require("./routes/posts"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/users", require("./routes/users"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/questions", require("./routes/questions"));
app.get("/", (req, res) => {
  res.json({ message: "⚖️ Law Blog API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
