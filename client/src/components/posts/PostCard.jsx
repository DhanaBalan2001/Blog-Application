import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toggleLikePost } from '../../services/post.js';
import LikeButton from '../likebutton/LikeButton.jsx';
import { getStoredUser } from '../../services/auth.js';
import './postcard.css';

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(
    post.likes && getStoredUser() ? 
    post.likes.includes(getStoredUser()._id) : 
    false
  );
  const [likesCount, setLikesCount] = useState(post.likes ? post.likes.length : 0);
  
  const handleLike = async () => {
    const response = await toggleLikePost(post._id);
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    return response;
  };
  
  return (
    <div className="post-card">
      <Link to={`/posts/${post._id}`} className="post-link">
        <h3 className="post-title">{post.title}</h3>
      </Link>
      
      <div className="post-meta">
        <Link to={`/profile/${post.author._id}`} className="author-link">
          <div className="author-avatar">
            {post.author.username.charAt(0).toUpperCase()}
          </div>
          <span className="author-name">{post.author.username}</span>
        </Link>
        
        <span className="post-date">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </span>
      </div>
      
      <p className="post-excerpt">
        {post.content.length > 150 
          ? `${post.content.substring(0, 150)}...` 
          : post.content}
      </p>
      
      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map(tag => (
            <Link key={tag} to={`/tag/${tag}`} className="tag">
              #{tag}
            </Link>
          ))}
        </div>
      )}
      
      <div className="post-actions">
        <LikeButton
          isLiked={liked}
          likesCount={likesCount}
          onLike={handleLike}
        />
        
        <Link to={`/posts/${post._id}`} className="comments-link">
          <span className="comment-icon">💬</span>
          <span className="comments-count">
            {post.comments ? post.comments.length : 0}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default PostCard;