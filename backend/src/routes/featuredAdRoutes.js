const express = require("express");
const router = express.Router();

const {
  getFeaturedAds,
  createFeaturedAd,
  updateFeaturedAd,
  deleteFeaturedAd,
} = require("../controllers/featuredAdController");

const { upload } = require("../config/cloudnary");

router.get("/", getFeaturedAds);
router.post("/", upload.single("image"), createFeaturedAd);
router.put("/:id", upload.single("image"), updateFeaturedAd);
router.delete("/:id", deleteFeaturedAd);

module.exports = router;