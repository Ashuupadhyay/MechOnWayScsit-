const fs = require("fs");
const path = require("path");
const Ad = require("../models/Ad");
const { ADS_DIR } = require("../middleware/uploadAd");

// Uploaded image ka public URL banata hai.
// Production me .env me BASE_URL=https://your-api-domain.com set kar do.
const buildImageUrl = (req, filename) => {
  const base = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
  return `${base.replace(/\/$/, "")}/uploads/ads/${filename}`;
};

const removeFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(ADS_DIR, path.basename(filename));
  fs.unlink(filePath, () => {});
};

// ------------------------------------------------------------
// PUBLIC: Directory page ke liye active ads
// GET /ads?placement=directory-left
// ------------------------------------------------------------
exports.getPublicAds = async (req, res) => {
  try {
    const placement = req.query.placement || "directory-left";
    const ads = await Ad.find({ placement, isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select("_id image link title")
      .lean();

    res.json({ success: true, data: ads });
  } catch (err) {
    console.error("getPublicAds:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------
// ADMIN: saare ads (active + inactive)
// GET /ads/admin/all
// ------------------------------------------------------------
exports.adminGetAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ order: 1, createdAt: -1 }).lean();
    res.json({ success: true, data: ads });
  } catch (err) {
    console.error("adminGetAds:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------
// ADMIN: naya ad  (multipart/form-data, field: image)
// POST /ads
// ------------------------------------------------------------
exports.createAd = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image zaroori hai" });
    }

    const { title = "", link = "", order = 0, isActive = true } = req.body;

    const ad = await Ad.create({
      image: buildImageUrl(req, req.file.filename),
      imageFile: req.file.filename,
      title,
      link,
      order: Number(order) || 0,
      isActive: String(isActive) !== "false",
    });

    res.status(201).json({ success: true, data: ad });
  } catch (err) {
    console.error("createAd:", err);
    if (req.file) removeFile(req.file.filename);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------
// ADMIN: ad edit (image optional)
// PUT /ads/:id
// ------------------------------------------------------------
exports.updateAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      if (req.file) removeFile(req.file.filename);
      return res.status(404).json({ success: false, message: "Ad nahi mila" });
    }

    const { title, link, order, isActive } = req.body;
    if (title !== undefined) ad.title = title;
    if (link !== undefined) ad.link = link;
    if (order !== undefined) ad.order = Number(order) || 0;
    if (isActive !== undefined) ad.isActive = String(isActive) !== "false";

    if (req.file) {
      removeFile(ad.imageFile); // purani image hata do
      ad.image = buildImageUrl(req, req.file.filename);
      ad.imageFile = req.file.filename;
    }

    await ad.save();
    res.json({ success: true, data: ad });
  } catch (err) {
    console.error("updateAd:", err);
    if (req.file) removeFile(req.file.filename);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------------------------------------------------
// ADMIN: ad delete
// DELETE /ads/:id
// ------------------------------------------------------------
exports.deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) {
      return res.status(404).json({ success: false, message: "Ad nahi mila" });
    }
    removeFile(ad.imageFile);
    res.json({ success: true, message: "Ad delete ho gaya" });
  } catch (err) {
    console.error("deleteAd:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};