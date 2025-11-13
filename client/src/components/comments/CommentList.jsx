import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getPostComments, addComment } from '../../services/comment.js';
import { isAuthenticated } from '../../services/auth.js';
import Comment from './Comment.jsx';
import Spinner from '../spinner/Spinner.jsx';
import './commentlist.css';

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    fetchComments();
  }, [postId]);
  
  const fetchComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await getPostComments(postId);
      setComments(fetchedComments);
      setError(null);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      toast.error('Please log in to comment');
      return;
    }
    
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      setSubmitting(true);
      const createdComment = await addComment(postId, newComment);
      
      // Add the new comment to the list
      setComments([createdComment, ...comments]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (err) {
      console.error('Error adding comment:', err);
      toast.error(err.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCommentUpdate = (updatedComment) => {
    setComments(comments.map(comment => 
      comment._id === updatedComment._id ? updatedComment : comment
    ));
  };
  
  const handleCommentDelete = (commentId) => {
    setComments(comments.filter(comment => comment._id !== commentId));
  };
  
  if (loading) {
    return <Spinner />;
  }
  
  return (
    <div className="comments-section">
      <h3 className="comments-title">Comments ({comments.length})</h3>
      
      {isAuthenticated() && (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="comment-textarea"
            rows="3"
            disabled={submitting}
          />
          <button 
            type="submit" 
            className="submit-comment-button"
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map(comment => (
            <Comment 
              key={comment._id} 
              comment={comment} 
              onCommentUpdate={handleCommentUpdate}
              onCommentDelete={handleCommentDelete}
            />
          ))
        ) : (
          <div className="no-comments-message">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList;
