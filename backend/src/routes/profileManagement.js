
const express = require("express");
const router = express.Router();
const upload = require("../middlewhere/multer");

const {
  getProfileById,
  updateProfileById,
} = require("../controllers/profileManagementController");

router.get("/:userId", ...getProfileById);

router.put(
  "/:userId",
  upload.single("profileImage"),
  ...updateProfileById
);

module.exports = router;
