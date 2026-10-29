const mongoose = require("mongoose");

const Review = require("../models/RodioReview");
const Profile = require("../models/profile");
const Business = require("../models/business");

// ==========================================
// HELPER - GET LOGGED IN USER ID
// ==========================================
const getUserId = (req) => {
  return req.user?._id || req.user?.id || req.userId || null;
};

// ==========================================
// HELPER - FORMAT REPLIES
// Returns replies with user name, firmName, profileImage
// ==========================================
const formatReplies = async (replies = []) => {
  if (!Array.isArray(replies) || replies.length === 0) return [];

  const userIds = [
    ...new Set(
      replies
        .map((r) => String(r.user?._id || r.user || ""))
        .filter(Boolean)
    ),
  ];

  const [profiles, businesses] = await Promise.all([
    Profile.find({ user: { $in: userIds } }).lean(),
    Business.find({ user: { $in: userIds } }).lean(),
  ]);

  const profileMap = {};
  profiles.forEach((p) => {
    profileMap[String(p.user)] = p;
  });

  const businessMap = {};
  businesses.forEach((b) => {
    businessMap[String(b.user)] = b;
  });

  return replies.map((reply) => {
    const r =
      reply && typeof reply.toObject === "function"
        ? reply.toObject()
        : reply;

    const uid = String(r.user?._id || r.user || "");
    const profile = profileMap[uid];
    const business = businessMap[uid];

    return {
      _id: r._id,
      comment: r.comment,
      parentReplyId: r.parentReplyId ? String(r.parentReplyId) : null,
      createdAt: r.createdAt,
      user: {
        _id: uid,
        name: profile?.name || business?.name || "RODIO User",
        firmName: profile?.firmName || business?.firmName || "",
        profileImage: profile?.profileImage || "",
      },
    };
  });
};


// ==========================================
// 1. ADD REVIEW
// One user can submit multiple reviews
// ==========================================
exports.addOrUpdateReview = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const { rating, comment } = req.body || {};

    // Rating validation
    if (
      rating === undefined ||
      rating === null ||
      rating === "" ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Comment validation
    if (typeof comment !== "string" || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please write your review",
      });
    }

    // Create new review (multiple reviews allowed)
    const review = await Review.create({
      user: userId,
      rating: Number(rating),
      comment: comment.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Add Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: error.message,
    });
  }
};


// ==========================================
// 2. GET ALL REVIEWS
// ALL USERS + ALL REVIEWS (with replies)
// ==========================================
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "mobile role")
      .sort({
        createdAt: -1,
      })
      .lean();

    console.log("TOTAL REVIEWS:", reviews.length);

    // Format reviews
    const formattedReviews = await Promise.all(
      reviews.map(async (review) => {
        const userId = review.user?._id || review.user || null;

        let profile = null;
        let business = null;

        if (userId) {
          profile = await Profile.findOne({
            user: userId,
          }).lean();

          business = await Business.findOne({
            user: userId,
          }).lean();
        }

        return {
          _id: review._id,

          rating: review.rating,

          comment: review.comment,

          createdAt: review.createdAt,

          updatedAt: review.updatedAt,

          // NEW: replies are now sent with every review
          replies: await formatReplies(review.replies),

          user: {
            _id: userId,

            role:
              review.user?.role ||
              profile?.role ||
              business?.category ||
              "",

            name:
              profile?.name ||
              business?.name ||
              "RODIO User",

            firmName:
              profile?.firmName ||
              business?.firmName ||
              "",

            profileImage: profile?.profileImage || "",

            mobile: review.user?.mobile || "",
          },
        };
      })
    );

    // Rating statistics
    const ratingStats = await Review.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const averageRating =
      ratingStats.length > 0 &&
      ratingStats[0].averageRating !== undefined
        ? Number(Number(ratingStats[0].averageRating).toFixed(1))
        : 0;

    const totalReviews =
      ratingStats.length > 0 ? ratingStats[0].totalReviews : 0;

    return res.status(200).json({
      success: true,
      averageRating,
      totalReviews,
      reviews: formattedReviews,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      error: error.message,
    });
  }
};


// ==========================================
// 3. GET MY REVIEWS
// Returns ALL reviews of logged-in user
// ==========================================
exports.getMyReview = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const reviews = await Review.find({
      user: userId,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    return res.status(200).json({
      success: true,
      totalReviews: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get My Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your reviews",
      error: error.message,
    });
  }
};


// ==========================================
// 4. DELETE MY REVIEW
// Deletes one review of logged-in user
// ==========================================
exports.deleteMyReview = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await Review.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found or you are not allowed to delete it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      review,
    });
  } catch (error) {
    console.error("Delete My Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};


// ==========================================
// 5. ADMIN UPDATE REVIEW
// PUT /api/admin/reviews/:id
// ==========================================
exports.adminUpdateReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const { rating, comment } = req.body || {};

    if (
      rating === undefined ||
      rating === null ||
      rating === "" ||
      Number(rating) < 1 ||
      Number(rating) > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (typeof comment !== "string" || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please write your review",
      });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      {
        rating: Number(rating),
        comment: comment.trim(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Admin Update Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};


// ==========================================
// 6. ADMIN DELETE REVIEW
// DELETE /api/admin/reviews/:id
// ==========================================
exports.adminDeleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      review,
    });
  } catch (error) {
    console.error("Admin Delete Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};


// ==========================================
// 7. ADD REPLY OR NESTED REPLY
// POST /api/reviews/:id/replies
// ==========================================
exports.addReviewReply = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;
    const { comment, parentReplyId = null } = req.body || {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID",
      });
    }

    if (typeof comment !== "string" || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply cannot be empty",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (parentReplyId) {
      const parentExists = review.replies.id(parentReplyId);

      if (!parentExists) {
        return res.status(404).json({
          success: false,
          message: "Parent reply not found",
        });
      }
    }

    review.replies.push({
      user: userId,
      comment: comment.trim(),
      parentReplyId: parentReplyId || null,
    });

    await review.save();

    const replies = await formatReplies(review.replies);

    return res.status(201).json({
      success: true,
      message: "Reply added successfully",
      review: {
        _id: review._id,
        replies,
      },
      replies,
    });
  } catch (error) {
    console.error("Add review reply error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add reply",
    });
  }
};


// ==========================================
// 8. DELETE OWN REPLY OR NESTED REPLY
// DELETE /api/reviews/:id/replies/:replyId
// ==========================================
exports.deleteReviewReply = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id, replyId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const reply = review.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    if (String(reply.user) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own reply",
      });
    }

    // Also delete nested replies belonging to this reply.
    const idsToDelete = new Set([String(replyId)]);
    let changed = true;

    while (changed) {
      changed = false;

      review.replies.forEach((item) => {
        const parentId = item.parentReplyId
          ? String(item.parentReplyId)
          : "";

        if (
          idsToDelete.has(parentId) &&
          !idsToDelete.has(String(item._id))
        ) {
          idsToDelete.add(String(item._id));
          changed = true;
        }
      });
    }

    review.replies = review.replies.filter(
      (item) => !idsToDelete.has(String(item._id))
    );

    await review.save();

    const replies = await formatReplies(review.replies);

    return res.status(200).json({
      success: true,
      message: "Reply deleted successfully",
      review: {
        _id: review._id,
        replies,
      },
      replies,
    });
  } catch (error) {
    console.error("Delete review reply error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete reply",
    });
  }
};