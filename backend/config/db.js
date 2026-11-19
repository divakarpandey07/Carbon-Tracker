const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/carbon-tracker";
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Ensure requested Administrator and User exist and have correct credentials
    const User = require("../models/User");

    // 1. Administrator: pandeydivakar07@gmail.com
    let adminUser = await User.findOne({ email: "pandeydivakar07@gmail.com" });
    if (!adminUser) {
      await User.create({
        name: "Divakar Pandey (Super Admin)",
        email: "pandeydivakar07@gmail.com",
        password: "Bairagi@101",
        role: "admin",
        organization: "CarbonTrack HQ (Super Admin)",
        providerStatus: "verified",
        isActive: true,
      });
      console.log("Created Administrator: pandeydivakar07@gmail.com");
    } else {
      adminUser.password = "Bairagi@101";
      adminUser.role = "admin";
      adminUser.isActive = true;
      await adminUser.save();
      console.log("Verified & reset Administrator password to Bairagi@101");
    }

    // 2. User: pandeydivakar1080@gmail.com
    let normalUser = await User.findOne({ email: "pandeydivakar1080@gmail.com" });
    if (!normalUser) {
      await User.create({
        name: "Divakar Pandey",
        email: "pandeydivakar1080@gmail.com",
        password: "Bairagi@101",
        role: "user",
        organization: "Lovely Professional University",
        providerStatus: "not_applied",
        isActive: true,
      });
      console.log("Created User: pandeydivakar1080@gmail.com");
    } else {
      normalUser.password = "Bairagi@101";
      normalUser.role = "user";
      normalUser.isActive = true;
      await normalUser.save();
      console.log("Verified & reset User password to Bairagi@101");
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;