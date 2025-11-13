import api from './api.js';
import { ENDPOINTS } from '../config/api.js';

// Create a new post
export const createPost = async (postData) => {
  try {
    const response = await api.post(ENDPOINTS.POSTS.BASE, postData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to create post';
  }
};

// Get all posts (with pagination)
export const getAllPosts = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`${ENDPOINTS.POSTS.BASE}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to fetch posts';
  }
};

// Get a single post by ID
export const getPostById = async (id) => {
  try {
    const response = await api.get(ENDPOINTS.POSTS.BY_ID(id));
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to fetch post';
  }
};

// Update a post
export const updatePost = async (id, postData) => {
  try {
    const response = await api.put(ENDPOINTS.POSTS.BY_ID(id), postData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to update post';
  }
};

// Delete a post
export const deletePost = async (id) => {
  try {
    const response = await api.delete(ENDPOINTS.POSTS.BY_ID(id));
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to delete post';
  }
};

// Like/unlike a post
export const toggleLikePost = async (postId) => {
  try {
    const response = await api.put(`/posts/like/${postId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to update like status';
  }
};


// Bookmark/unbookmark a post
export const toggleBookmarkPost = async (id) => {
  try {
    const response = await api.post(ENDPOINTS.POSTS.BOOKMARK(id));
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to update bookmark status';
  }
};

// Get posts by tag
export const getPostsByTag = async (tag) => {
  try {
    const response = await api.get(ENDPOINTS.POSTS.BY_TAG(tag));
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to fetch posts by tag';
  }
};

// Search posts
export const searchPosts = async (query) => {
  try {
    const response = await api.get(`${ENDPOINTS.POSTS.SEARCH}?query=${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to search posts';
  }
};