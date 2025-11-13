import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import './commentitem.css';

const CommentItem = ({ comment, currentUser }) => {
  const { _id, content, author, createdAt } = comment;
  
  // Format the date to show "X time ago"
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  const isAuthor = currentUser && currentUser._id === author._id;
  
  return (
    <div className="comment-item">
      <div className="comment-header">
        <div className="comment-author">
          <Link to={`/profile/${author._id}`} className="author-link">
            <div className="author-avatar">
              {author.username.charAt(0).toUpperCase()}
            </div>
            <span className="author-name">{author.username}</span>
          </Link>
        </div>
        <span className="comment-date">{timeAgo}</span>
      </div>
      
      <div className="comment-content">
        {content}
      </div>
      
      {isAuthor && (
        <div className="comment-actions">
          {/* You can add edit/delete functionality here in the future */}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
