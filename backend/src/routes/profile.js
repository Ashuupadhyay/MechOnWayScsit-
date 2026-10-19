
const express = require("express");
const protect = require("../middlewhere/protectAPi");
const router = express.Router();
const upload = require("../middlewhere/multer");
const auth = require("../middlewhere/auth");

const {
  getProfile,
  updateProfile,
  updateAdImage,
} = require("../controllers/profileController");

router.get("/",auth, getProfile);

// Existing Profile Photo — unchanged
router.put("/", auth,upload.single("profileImage"), updateProfile);

// New separate Ad Photo upload
router.put("/ad-image", auth,upload.single("adImage"), updateAdImage);

module.exports = router;
