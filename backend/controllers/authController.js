const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, organization } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const user = await User.create({ name, email, password, organization: organization || null });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      organization: user.organization,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    console.error("GETME ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

const applyAsProvider = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "user") {
      return res.status(400).json({ message: "Only regular users can apply" });
    }
    user.providerStatus = "pending";
    await user.save();
    res.status(200).json({ message: "Provider application submitted", providerStatus: user.providerStatus });
  } catch (error) {
    console.error("APPLY PROVIDER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, applyAsProvider };