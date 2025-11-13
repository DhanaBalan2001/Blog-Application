import api from './api.js';
import { ENDPOINTS } from '../config/api.js';
import axios from 'axios';
import { API_BASE_URL } from '../config/api.js';

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to fetch user profile';
  }
};

// Update current user profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put(ENDPOINTS.AUTH.CURRENT, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to update profile';
  }
};

// Get user's bookmarked posts
export const getUserBookmarks = async () => {
  try {
    const response = await api.get('/users/bookmarks');
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to fetch bookmarks';
  }
};

// Get user posts
export const getUserPosts = async (userId) => {
  try {
    const response = await api.get(`/posts/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to fetch user posts';
  }
};

// Follow a user
export const followUser = async (userId) => {
  try {
    const response = await api.put(`/users/follow/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to follow user';
  }
};

// Unfollow a user
export const unfollowUser = async (userId) => {
  try {
    const response = await api.put(`/users/unfollow/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to unfollow user';
  }
};

// Get user followers
export const getUserFollowers = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/followers`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to fetch followers';
  }
};

// Get user following
export const getUserFollowing = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/following`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to fetch following';
  }
};

export const updateProfilePictureUrl = async (pictureUrl) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await axios({
      method: 'put',
      url: `${API_BASE_URL}/users/profile-picture`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: {
        pictureUrl: pictureUrl
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Full error:', error);
    throw error.response?.data?.msg || 'Failed to update profile picture';
  }
};