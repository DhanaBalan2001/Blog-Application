import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { 
  toggleLikeComment,
  deleteComment,
  editComment,
  getCommentReplies
} from '../../services/comment.js';
import { getStoredUser, isAuthenticated } from '../../services/auth.js';
import LikeButton from '../likebutton/LikeButton.jsx';
import './comment.css';

const Comment = ({ comment, onCommentUpdate, onCommentDelete }) => {
  const [liked, setLiked] = useState(
    comment.likes && getStoredUser() ? 
    comment.likes.includes(getStoredUser()._id) : 
    false
  );
  const [likesCount, setLikesCount] = useState(comment.likes ? comment.likes.length : 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  
  const currentUser = getStoredUser();
  const isCommentAuthor = currentUser && currentUser._id === comment.author._id;
  
  const handleLike = async () => {
    try {
      const response = await toggleLikeComment(comment._id);
      setLiked(!liked);
      setLikesCount(response.length);
      return response;
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  };
  
  const handleDelete = async () => {
    if (!isCommentAuthor) return;
    
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteComment(comment._id);
        toast.success('Comment deleted successfully');
        if (onCommentDelete) onCommentDelete(comment._id);
      } catch (error) {
        console.error('Error deleting comment:', error);
        toast.error(error.message || 'Failed to delete comment');
      }
    }
  };
  
  const handleEdit = () => {
    if (!isCommentAuthor) return;
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };
  
  const handleSaveEdit = async () => {
    if (!editedContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      const updatedComment = await editComment(comment._id, editedContent);
      setIsEditing(false);
      if (onCommentUpdate) onCommentUpdate(updatedComment);
      toast.success('Comment updated successfully');
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error(error.message || 'Failed to update comment');
    }
  };
  
  const loadReplies = async () => {
    if (!showReplies) {
      try {
        setLoadingReplies(true);
        const fetchedReplies = await getCommentReplies(comment._id);
        setReplies(fetchedReplies);
        setShowReplies(true);
      } catch (error) {
        console.error('Error fetching replies:', error);
        toast.error(error.message || 'Failed to load replies');
      } finally {
        setLoadingReplies(false);
      }
    } else {
      setShowReplies(false);
    }
  };
  
  return (
    <div className="comment">
      <div className="comment-header">
        <Link to={`/profile/${comment.author._id}`} className="comment-author">
          <div className="author-avatar">
            {comment.author.profilePicture ? (
              <img 
                src={comment.author.profilePicture}
                alt={comment.author.username}
                className="avatar-image"
              />
            ) : (
              comment.author.username.charAt(0).toUpperCase()
            )}
          </div>
          <span className="author-name">{comment.author.username}</span>
        </Link>
        
        <span className="comment-date">
          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
        </span>
      </div>
      
      <div className="comment-content">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="edit-comment-textarea"
            rows="3"
          />
        ) : (
          <p>{comment.content}</p>
        )}
      </div>
      
      <div className="comment-actions">
        {isAuthenticated() && (
          <LikeButton 
            isLiked={liked}
            likesCount={likesCount}
            onLike={handleLike}
            size="small"
          />
        )}
        
        <button 
          className="reply-button"
          onClick={loadReplies}
        >
          {loadingReplies ? 'Loading...' : showReplies ? 'Hide Replies' : 'Show Replies'}
          {!showReplies && comment.replyCount > 0 && ` (${comment.replyCount})`}
        </button>
        
        {isCommentAuthor && (
          <div className="author-actions">
            {isEditing ? (
              <>
                <button 
                  className="cancel-edit-button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button 
                  className="save-edit-button"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button 
                  className="edit-button"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button 
                  className="delete-button"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      {showReplies && (
        <div className="comment-replies">
          {replies.length > 0 ? (
            replies.map(reply => (
              <Comment 
                key={reply._id}
                comment={reply}
                onCommentUpdate={(updatedReply) => {
                  setReplies(replies.map(r => 
                    r._id === updatedReply._id ? updatedReply : r
                  ));
                }}
                onCommentDelete={(replyId) => {
                  setReplies(replies.filter(r => r._id !== replyId));
                }}
              />
            ))
          ) : (
            <p className="no-replies">No replies yet</p>
          )}
          
          {isAuthenticated() && (
            <div className="add-reply">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="reply-textarea"
                rows="2"
              />
              <button 
                className="submit-reply-button"
                disabled={!replyContent.trim() || submittingReply}
                onClick={async () => {
                  toast.info('Reply functionality coming soon!');
                }}
              >
                {submittingReply ? 'Submitting...' : 'Reply'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;