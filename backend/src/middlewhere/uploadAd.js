const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Ads ki images yahan save hongi: <project>/uploads/ads
const ADS_DIR = path.join(__dirname, "..", "uploads", "ads");
fs.mkdirSync(ADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, ADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `ad-${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (/^image\/(jpe?g|png|webp)$/i.test(file.mimetype)) return cb(null, true);
  cb(new Error("Sirf JPG, PNG ya WEBP image upload karo"));
};

const uploadAd = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = { uploadAd, ADS_DIR };