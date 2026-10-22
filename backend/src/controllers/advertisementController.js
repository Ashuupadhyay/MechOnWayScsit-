const mongoose = require("mongoose");
const Profile = require("../models/profile");
const User = require("../models/register");
const { uploadToCloudinary } = require("../config/cloudnary");

// GET advertisement details by User ObjectId
const getAdvertisementByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid User ObjectId is required",
      });
    }

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profile = await Profile.findOne({ user: userId }).lean();

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        role: user.role || "",
        firmName: user.firmName || "",
        mobile: user.mobile || "",
      },
      advertisement: {
        adImage: profile?.adImage || "",
      },
    });
  } catch (error) {
    console.error("Get Advertisement Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch advertisement",
    });
  }
};

// UPLOAD / UPDATE advertisement image
const updateAdvertisementImage = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid User ObjectId is required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an advertisement image",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const adImageUrl = await uploadToCloudinary(
      req.file.buffer,
      "advertisements"
    );

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
      profile = new Profile({
        user: userId,
        role: user.role,
        firmName: user.firmName || "",
        phoneNumber: user.mobile || "",
        adImage: adImageUrl,
      });
    } else {
      profile.adImage = adImageUrl;
    }

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Advertisement image uploaded successfully",
      advertisement: {
        userId,
        adImage: profile.adImage,
      },
    });
  } catch (error) {
    console.error("Update Advertisement Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload advertisement image",
    });
  }
};

module.exports = {
  getAdvertisementByUserId,
  updateAdvertisementImage,
};