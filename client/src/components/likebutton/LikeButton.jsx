import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isAuthenticated } from '../../services/auth.js';
import './likebutton.css';

const LikeButton = ({ 
  isLiked, 
  likesCount, 
  onLike, 
  size = 'medium' 
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLike = async () => {
    if (!isAuthenticated()) {
      toast.info('Please log in to like this post');
      navigate('/login');
      return;
    }
    
    try {
      setLoading(true);
      await onLike();
    } catch (error) {
      console.error('Error liking:', error);
      toast.error(error.message || 'Failed to like');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button 
      className={`like-button ${isLiked ? 'liked' : ''} ${size}`}
      onClick={handleLike}
      disabled={loading}
      aria-label={isLiked ? 'Unlike' : 'Like'}
    >
      <span className="like-icon">
        {isLiked ? '❤️' : '🤍'}
      </span>
      {likesCount > 0 && (
        <span className="likes-count">{likesCount}</span>
      )}
    </button>
  );
};

export default LikeButton;
