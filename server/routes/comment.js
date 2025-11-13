import express from 'express';
import { 
  addComment, 
  getPostComments,
  deleteComment,
  editComment,
  toggleLikeComment,
  getCommentReplies,
  ReplyComment
} from '../controllers/comment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Add comment to post
router.post('/:postId', protect, addComment);

// Get comments for a post
router.get('/:postId', getPostComments);

// Delete a comment
router.delete('/:id', protect, deleteComment);

// Edit a comment
router.put('/:id', protect, editComment);

// Like/unlike a comment
router.put('/like/:id', protect, toggleLikeComment);

// Add reply to a comment
router.post('/reply/:id', protect, ReplyComment);

// Get replies for a comment
router.get('/replies/:id', getCommentReplies);


export default router;