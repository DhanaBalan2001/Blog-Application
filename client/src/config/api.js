// Base API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL;

// API endpoints
const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    PROFILE: '/users/profile',
    CURRENT: '/users/me',
  },
  
  // Post endpoints
  POSTS: {
    BASE: '/posts',
    BY_ID: (id) => `/posts/${id}`,
    LIKE: (id) => `/posts/like/${id}`,
    BOOKMARK: (id) => `/posts/bookmark/${id}`,
    BY_TAG: (tag) => `/posts/tag/${tag}`,
    SEARCH: '/posts/search',
  },
  
  // Comment endpoints
  COMMENTS: {
    BY_POST: (postId) => `/comments/${postId}`,
    BY_ID: (id) => `/comments/${id}`,
    LIKE: (commentId) => `/comments/like/${commentId}`,
    REPLIES: (id) => `/comments/replies/${id}`,
  },
  
  // Notification endpoints
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: (id) => `/notifications/${id}`,
  }
};

// Export configuration
export { API_BASE_URL, ENDPOINTS };
