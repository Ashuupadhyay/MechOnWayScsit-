
const express = require("express");
const router = express.Router();

const {
  addOrUpdateReview,
  getAllReviews,
  getMyReview,
  deleteMyReview,
  addReviewReply,
  deleteReviewReply,
} = require("../controllers/rodioreviewController");

// Authentication middleware
const auth = require("../middlewhere/auth");

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all Rodio reviews
router.get("/", getAllReviews);

// ==========================================
// PRIVATE ROUTES - LOGIN REQUIRED
// ==========================================

// Get logged-in user's reviews
router.get("/my-review", auth, getMyReview);

// Add a new Rodio review
router.post("/", auth, addOrUpdateReview);

// Delete own Rodio review
router.delete("/my-review/:id", auth, deleteMyReview);

// Add a reply or nested reply to a review
router.post("/:id/replies", auth, addReviewReply);

// Delete own reply or nested reply
router.delete("/:id/replies/:replyId", auth, deleteReviewReply);

module.exports = router;
