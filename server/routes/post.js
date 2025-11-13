import express from 'express';
import { 
  createPost, 
  updatePost,
  deletePost,
  getAllPosts, 
  getPostById, 
  toggleLikePost, 
  toggleBookmarkPost,
  searchPosts,
  getPostsByTag,
  getPostsByUser
} from '../controllers/post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create a post
router.post('/', protect, createPost);

// For updating a post
router.put('/posts/:id', protect, updatePost);

// For deleting a post
router.delete('/posts/:id', protect, deletePost);

// Get all posts
router.get('/', getAllPosts);

// Get posts by user
router.get('/user/:userId', getPostsByUser);

// Search posts
router.get('/search', searchPosts);

// Get post by ID
router.get('/:id', getPostById);

// Like/unlike a post
router.put('/like/:id', protect, toggleLikePost);

// Bookmark/unbookmark a post
router.put('/bookmark/:id', protect, toggleBookmarkPost);

// Get posts by tag
router.get('/tag/:tag', getPostsByTag);

export default router;