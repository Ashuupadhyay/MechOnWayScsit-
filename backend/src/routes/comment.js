const express = require('express');
const protect = require('../middlewhere/protectAPi');

const router = express.Router();

const {
  addComment,
  getTransporterComments,
  addReply,
  deleteComment,
  deleteReply,
} = require('../controllers/commentController');

const isAuthenticated = require('../middlewhere/auth');

router.post('/:id', protect, isAuthenticated, addComment);

router.get('/:id', protect, getTransporterComments);

router.post(
  '/:id/:commentId/reply',
  protect,
  isAuthenticated,
  addReply
);

router.delete(
  '/:id/:commentId',
  protect,
  isAuthenticated,
  deleteComment
);

router.delete(
  '/:id/:commentId/reply/:replyId',
  protect,
  isAuthenticated,
  deleteReply
);

module.exports = router;