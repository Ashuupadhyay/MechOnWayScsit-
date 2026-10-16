
const mongoose = require("mongoose");

const {
  getProfile,
  updateProfile,
} = require("./profileController");

const validateUserId = (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId || "")) {
    return res.status(400).json({
      success: false,
      message: "Valid User ObjectId is required",
    });
  }

  // Existing controller ko bina badle ID provide karein.
  req.user = { id: userId };

  next();
};

module.exports = {
  getProfileById: [
    validateUserId,
    getProfile,
  ],
  updateProfileById: [
    validateUserId,
    updateProfile,
  ],
};
