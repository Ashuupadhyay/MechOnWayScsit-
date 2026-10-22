const express = require("express");
const router = express.Router();
const upload = require("../middlewhere/multer");

const {
  getAdvertisementByUserId,
  updateAdvertisementImage,
} = require("../controllers/advertisementController");

router.get("/:userId", getAdvertisementByUserId);

router.put(
  "/:userId/ad-image",
  upload.single("adImage"),
  updateAdvertisementImage
);

module.exports = router;