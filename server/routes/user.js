import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserById,
  getUserProfile, 
  updateUserProfile,
  updateProfilePictureUrl,
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing
} from '../controllers/user.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Register user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile
router.get('/me', protect, getUserProfile);

// Get user profile by ID
router.get('/:id', getUserById);

// Update user profile
router.put('/me', protect, updateUserProfile);

// Profile picture upload
router.post('/profile-picture', protect, updateProfilePictureUrl);

// Follow
router.put('/follow/:id', protect, followUser);
router.put('/unfollow/:id', protect, unfollowUser);
router.get('/:id/followers', getUserFollowers);
router.get('/:id/following', getUserFollowing);

export default router;