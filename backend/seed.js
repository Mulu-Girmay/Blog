const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lawblog";
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to database");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log(`   Username: ${existingAdmin.username}`);
      console.log("   Skipping creation...");
      process.exit(0);
    }

    // Create admin user
    const admin = new User({
      username: "@kalayu",
      email: "kalayu@email.com",
      password: "kalayu123", // ⚠️ CHANGE THIS PASSWORD!
      role: "admin",
      bio: "Founder & Lead Advocate",
    });

    await admin.save();

    console.log("✅ Admin user created successfully!");

    process.exit(0);
  } catch (err) {
    console.error(" Error creating admin:", err.message);
    if (err.code === "ECONNREFUSED") {
      console.log("\n⚠️  MongoDB is not running!");
      console.log("   Start MongoDB with:");
      console.log("   - Mac: brew services start mongodb-community");
      console.log("   - Linux: sudo systemctl start mongodb");
      console.log("   - Or use MongoDB Atlas");
    }
    process.exit(1);
  }
};

createAdmin();
