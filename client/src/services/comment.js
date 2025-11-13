import api from './api.js';
import { ENDPOINTS } from '../config/api.js';

export const getPostComments = async (postId) => {
  try {
    const response = await api.get(ENDPOINTS.COMMENTS.BY_POST(postId));
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to fetch comments';
  }
};

export const addComment = async (postId, commentData) => {
  try {
    const response = await api.post(ENDPOINTS.COMMENTS.BY_POST(postId), commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to add comment';
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to delete comment';
  }
};

export const editComment = async (commentId, commentData) => {
  try {
    const response = await api.put(`/comments/${commentId}`, commentData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to update comment';
  }
};

export const toggleLikeComment = async (commentId) => {
  try {
    const response = await api.put(`/comments/like/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to like comment';
  }
};

export const replyToComment = async (postId, parentCommentId, replyData) => {
  try {
    const data = {
      ...replyData,
      parentComment: parentCommentId
    };
    const response = await api.post(ENDPOINTS.COMMENTS.BY_POST(postId), data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to reply to comment';
  }
};

export const getCommentReplies = async (commentId) => {
  try {
    const response = await api.get(`/comments/replies/${commentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || 'Failed to fetch replies';
  }
};

export default {
  getPostComments,
  addComment,
  deleteComment,
  editComment,
  toggleLikeComment,
  replyToComment,
  getCommentReplies
};