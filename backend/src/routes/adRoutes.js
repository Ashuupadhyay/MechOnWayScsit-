const express = require("express");
const router = express.Router();

const {
  getPublicAds,
  adminGetAds,
  createAd,
  updateAd,
  deleteAd,
} = require("../controllers/adController");
const { uploadAd } = require("../middleware/uploadAd");

// >>> Agar tumhare paas pehle se admin-auth middleware hai to yahan usko import karo <<<
const adminAuth = require("../middleware/adminAuth");

// multer ke errors (galat file type / size) ko saaf message me badalta hai
const handleUpload = (req, res, next) => {
  uploadAd.single("image")(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image 5MB se choti honi chahiye"
          : err.message;
      return res.status(400).json({ success: false, message });
    }
    next();
  });
};

// PUBLIC (Directory page)
router.get("/", getPublicAds);

// ADMIN
router.get("/admin/all", adminAuth, adminGetAds);
router.post("/", adminAuth, handleUpload, createAd);
router.put("/:id", adminAuth, handleUpload, updateAd);
router.delete("/:id", adminAuth, deleteAd);

module.exports = router;