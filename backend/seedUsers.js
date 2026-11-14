const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const User = require("./models/User");
const Activity = require("./models/Activity");
const Challenge = require("./models/Challenge");
const ChallengeParticipant = require("./models/ChallengeParticipant");
const OffsetListing = require("./models/OffsetListing");
const { calculateCO2 } = require("./utils/emissionFactors");

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/carbon-tracker";
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB at ${mongoUri}`);

    console.log("Deleting all previous users and related data...");
    await User.deleteMany({});
    await Activity.deleteMany({});
    await ChallengeParticipant.deleteMany({});

    console.log("Creating requested Administrator and User accounts...");
    // 1. Administrator Account
    const adminUser = await User.create({
      name: "Divakar Pandey (Super Admin)",
      email: "pandeydivakar07@gmail.com",
      password: "Bairagi@101",
      role: "admin",
      organization: "CarbonTrack HQ (Super Admin)",
      providerStatus: "verified",
      isActive: true,
    });
    console.log(`✓ Admin created: ${adminUser.email} (Role: ${adminUser.role})`);

    // 2. Standard User Account
    const normalUser = await User.create({
      name: "Divakar Pandey",
      email: "pandeydivakar1080@gmail.com",
      password: "Bairagi@101",
      role: "user",
      organization: "Lovely Professional University",
      providerStatus: "not_applied",
      isActive: true,
    });
    console.log(`✓ User created: ${normalUser.email} (Role: ${normalUser.role})`);

    // Create a few student peers for the Leaderboard
    const studentPeers = [
      { name: "Gungun", email: "gungun@gmail.com", points: 980, org: "Lovely Professional University" },
      { name: "Ayush", email: "ayush@gmail.com", points: 850, org: "Lovely Professional University" },
      { name: "Vanshul", email: "vanshul@gmail.com", points: 720, org: "Lovely Professional University" },
      { name: "Rahul", email: "rahul@gmail.com", points: 610, org: "BHU Varanasi Campus" },
    ];

    for (const peer of studentPeers) {
      await User.create({
        name: peer.name,
        email: peer.email,
        password: "Password123!",
        role: "user",
        organization: peer.org,
        isActive: true,
      });
    }

    // Seed default challenges if none exist
    let challenge = await Challenge.findOne();
    if (!challenge) {
      challenge = await Challenge.create({
        title: "Campus & Regional Eco Quest",
        description: "Zero plastic & smart commute challenge",
        category: "transport",
        targetType: "reduce_co2",
        targetValue: 50,
        pointsReward: 100,
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-12-31"),
        createdBy: adminUser._id,
      });
      console.log("✓ Default challenge created");
    }

    // Seed challenge participations for leaderboard
    await ChallengeParticipant.create({
      challenge: challenge._id,
      user: adminUser._id,
      progressValue: 100,
      isCompleted: true,
      pointsEarned: 1250,
      completedAt: new Date(),
    });

    await ChallengeParticipant.create({
      challenge: challenge._id,
      user: normalUser._id,
      progressValue: 75,
      isCompleted: true,
      pointsEarned: 1050,
      completedAt: new Date(),
    });

    // Seed initial activity logs for normalUser so Dashboard, Charts & Telemetry are live
    const sampleActivities = [
      {
        user: normalUser._id,
        category: "transport",
        subType: "car",
        quantity: 25,
        unit: "km",
        date: new Date(Date.now() - 86400000 * 2),
        notes: "Daily commute to college campus",
        metadata: { fuelType: "petrol", carSize: "medium", carAge: "mid" },
        co2Emitted: calculateCO2("transport", "car", 25, { fuelType: "petrol", carSize: "medium", carAge: "mid" }),
      },
      {
        user: normalUser._id,
        category: "electricity",
        subType: "grid",
        quantity: 45,
        unit: "kWh",
        date: new Date(Date.now() - 86400000 * 4),
        notes: "Monthly room electricity consumption",
        co2Emitted: calculateCO2("electricity", "grid", 45),
      },
      {
        user: normalUser._id,
        category: "food",
        subType: "vegetarian",
        quantity: 14,
        unit: "meals",
        date: new Date(Date.now() - 86400000 * 1),
        notes: "Campus cafeteria vegetarian meals",
        co2Emitted: calculateCO2("food", "vegetarian", 14),
      },
      {
        user: normalUser._id,
        category: "waste",
        subType: "recycled",
        quantity: 5,
        unit: "kg",
        date: new Date(),
        notes: "Recycled cardboard & plastic waste",
        co2Emitted: calculateCO2("waste", "recycled", 5),
      },
    ];

    await Activity.insertMany(sampleActivities);
    console.log(`✓ Seeded ${sampleActivities.length} sample activities for ${normalUser.email}`);

    // Seed sample marketplace listings if empty
    const listingCount = await OffsetListing.countDocuments();
    if (listingCount === 0) {
      await OffsetListing.create([
        {
          provider: adminUser._id,
          title: "Ganga Basin Afforestation Project",
          description: "Planting native banyan & neem trees along Varanasi riverbanks to sequester carbon.",
          offsetType: "tree_planting",
          pricePerUnit: 0.15,
          availableQuantity: 5000,
          location: "Varanasi, Uttar Pradesh",
          isActive: true,
        },
        {
          provider: adminUser._id,
          title: "Punjab Solar Farming Initiative",
          description: "Decentralized solar energy grids powering rural agro-machinery and schools.",
          offsetType: "renewable_energy",
          pricePerUnit: 0.20,
          availableQuantity: 8000,
          location: "Jalandhar, Punjab",
          isActive: true,
        },
      ]);
      console.log("✓ Sample offset marketplace listings created");
    }

    console.log("\n=========================================");
    console.log("DATABASE SEEDING SUCCESSFUL!");
    console.log("Administrator:");
    console.log("  Email:    pandeydivakar07@gmail.com");
    console.log("  Password: Bairagi@101");
    console.log("  Role:     admin");
    console.log("User:");
    console.log("  Email:    pandeydivakar1080@gmail.com");
    console.log("  Password: Bairagi@101");
    console.log("  Role:     user");
    console.log("=========================================\n");

    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedDatabase();
