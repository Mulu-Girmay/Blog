const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET must be set before the server can start.");
  process.exit(1);
}

const configuredOrigins = (process.env.FRONTEND_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = configuredOrigins.length
  ? configuredOrigins
  : process.env.NODE_ENV !== "production"
    ? ["http://localhost:3000"]
    : [];

if (process.env.NODE_ENV === "production" && !allowedOrigins.length) {
  console.error("FRONTEND_ORIGIN must be set in production.");
  process.exit(1);
}

const app = express();
const uploadsPath = path.join(__dirname, "uploads");

fs.mkdirSync(uploadsPath, { recursive: true });
app.set("trust proxy", 1);

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origin not allowed by CORS"));
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsPath));

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lawblog")
  .then(() => console.log(" Database connected"))
  .catch((err) => console.log(" Database error:", err));

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
  console.log(`Server running on http://localhost:${PORT}`);
});
