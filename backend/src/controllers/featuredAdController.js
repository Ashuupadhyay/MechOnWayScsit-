const FeaturedAd = require("../models/FeaturedAd");

const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../config/cloudnary");

// GET ALL FEATURED ADS
exports.getFeaturedAds = async (req, res) => {
  try {
    const filter = { isActive: true };

    if (req.query.placement) {
      filter.placement = req.query.placement;
    }

    const ads = await FeaturedAd.find(filter).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: ads.length,
      ads,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE FEATURED AD
exports.createFeaturedAd = async (req, res) => {
  try {
    const { title, link, placement, sortOrder } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    if (!["directory", "transport"].includes(placement)) {
      return res.status(400).json({
        success: false,
        message: "Invalid placement",
      });
    }

    const uploadResult = await require("../config/cloudnary")
      .cloudinary.uploader.upload_stream;

    const cloudinary = require("../config/cloudnary").cloudinary;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "rodio_featured_ads",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    const ad = await FeaturedAd.create({
      title: title || "",
      link: link || "",
      image: result.secure_url,
      publicId: result.public_id,
      placement,
      sortOrder: Number(sortOrder) || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Advertisement created successfully",
      ad,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE FEATURED AD
exports.updateFeaturedAd = async (req, res) => {
  try {
    const ad = await FeaturedAd.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    const { title, link, placement, sortOrder, isActive } = req.body;

    if (placement && !["directory", "transport"].includes(placement)) {
      return res.status(400).json({
        success: false,
        message: "Invalid placement",
      });
    }

    if (title !== undefined) ad.title = title;
    if (link !== undefined) ad.link = link;
    if (placement !== undefined) ad.placement = placement;
    if (sortOrder !== undefined) ad.sortOrder = Number(sortOrder) || 0;

    if (isActive !== undefined) {
      ad.isActive = isActive === true || isActive === "true";
    }

    let oldPublicId = null;

    if (req.file) {
      const cloudinary = require("../config/cloudnary").cloudinary;

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "rodio_featured_ads",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      oldPublicId = ad.publicId;
      ad.image = result.secure_url;
      ad.publicId = result.public_id;
    }

    await ad.save();

    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId, "image").catch(console.error);
    }

    return res.status(200).json({
      success: true,
      message: "Advertisement updated successfully",
      ad,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE FEATURED AD
exports.deleteFeaturedAd = async (req, res) => {
  try {
    const ad = await FeaturedAd.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    await FeaturedAd.findByIdAndDelete(req.params.id);

    await deleteFromCloudinary(ad.publicId, "image").catch(console.error);

    return res.status(200).json({
      success: true,
      message: "Advertisement deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};