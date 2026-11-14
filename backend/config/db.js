const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/carbon-tracker";
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Ensure requested Administrator and User exist
    const User = require("../models/User");
    const adminExists = await User.findOne({ email: "pandeydivakar07@gmail.com" });
    if (!adminExists) {
      await User.create({
        name: "Divakar Pandey (Super Admin)",
        email: "pandeydivakar07@gmail.com",
        password: "Bairagi@101",
        role: "admin",
        organization: "CarbonTrack HQ (Super Admin)",
        providerStatus: "verified",
        isActive: true,
      });
      console.log("Auto-created default Administrator: pandeydivakar07@gmail.com");
    }

    const userExists = await User.findOne({ email: "pandeydivakar1080@gmail.com" });
    if (!userExists) {
      await User.create({
        name: "Divakar Pandey",
        email: "pandeydivakar1080@gmail.com",
        password: "Bairagi@101",
        role: "user",
        organization: "Lovely Professional University",
        providerStatus: "not_applied",
        isActive: true,
      });
      console.log("Auto-created default User: pandeydivakar1080@gmail.com");
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;