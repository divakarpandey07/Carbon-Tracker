const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:3001"
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(morgan("dev"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Carbon Tracker API running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/activities", require("./routes/activityRoutes"));
app.use("/api/footprint", require("./routes/footprintRoutes"));
app.use("/api/challenges", require("./routes/challengeRoutes"));
app.use("/api/marketplace", require("./routes/marketplaceRoutes"));
app.use("/api/checkout", require("./routes/checkoutRoutes"));
app.use("/api/verification", require("./routes/verificationRoutes"));
app.use("/api/feed", require("./routes/feedRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/team-challenges", require("./routes/teamChallengeRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});