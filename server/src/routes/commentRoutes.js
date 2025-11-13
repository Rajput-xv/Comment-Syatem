import express from 'express';
import {
  createComment,
  getComments,
  getReplies,
  updateComment,
  deleteComment,
  toggleLike,
  getLikes,
} from '../controllers/commentController.js';
import { protect, verifiedOnly } from '../middleware/auth.js';
import { commentValidation, validate } from '../middleware/validator.js';
import { commentLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', protect, verifiedOnly, commentLimiter, commentValidation, validate, createComment);
router.get('/post/:postId', getComments);
router.get('/:commentId/replies', getReplies);
router.put('/:id', protect, verifiedOnly, commentValidation, validate, updateComment);
router.delete('/:id', protect, verifiedOnly, deleteComment);
router.post('/:id/like', protect, verifiedOnly, toggleLike);
router.get('/:id/likes', getLikes);

export default router;
