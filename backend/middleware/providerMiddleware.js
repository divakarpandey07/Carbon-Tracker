// Ensures the logged-in user is a verified offset provider
const requireVerifiedProvider = (req, res, next) => {
  const isVerifiedProvider = req.user?.providerStatus === "verified";

  if (!isVerifiedProvider) {
    if (req.user?.role === "provider") {
      return res.status(403).json({
        message: "Your provider account is not yet verified. Please wait for admin approval.",
      });
    }

    return res.status(403).json({ message: "Only offset providers can access this route" });
  }

  next();
};

module.exports = { requireVerifiedProvider };