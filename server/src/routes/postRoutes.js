import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { protect, verifiedOnly } from '../middleware/auth.js';
import { postValidation, validate } from '../middleware/validator.js';

const router = express.Router();

router.route('/')
  .get(getPosts)
  .post(protect, verifiedOnly, postValidation, validate, createPost);

router.route('/:id')
  .get(getPost)
  .put(protect, verifiedOnly, postValidation, validate, updatePost)
  .delete(protect, verifiedOnly, deletePost);

export default router;
