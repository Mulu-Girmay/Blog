const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const User = require("./models/User");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lawblog";

    // Log which database we're seeding (credentials redacted) so it's
    // obvious if this doesn't match the DB your running server uses.
    console.log(
      "🔌 Seeding into MongoDB:",
      mongoURI.replace(/\/\/[^@]+@/, "//<credentials>@"),
    );

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
      password: "kalayu123",
      role: "admin",
      bio: "Founder & Lead Advocate",
    });

    await admin.save();

    console.log("✅ Admin user created successfully!");
    console.log(`   Username: "${admin.username}"  (include the @ symbol)`);
    console.log(`   Password: "kalayu123"`);
    console.log(
      "   ⚠️  Log in with these exact values, then change the password.",
    );

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
