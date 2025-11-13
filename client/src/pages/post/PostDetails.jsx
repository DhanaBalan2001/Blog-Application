import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getPostById, toggleLikePost, toggleBookmarkPost } from '../../services/post.js';
import { getPostComments, addComment } from '../../services/comment.js';
import { getStoredUser } from '../../services/auth.js';
import Spinner from '../../components/spinner/Spinner.jsx';
import CommentItem from '../../components/comments/CommentItem.jsx';
import CommentList from '../../components/comments/CommentList.jsx';
import './postdetails.css';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = getStoredUser();
  
  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        const postData = await getPostById(id);
        setPost(postData);
        
        const commentsData = await getPostComments(id);
        setComments(commentsData);
      } catch (err) {
        console.error('Error fetching post details:', err);
        setError('Failed to load post. It may have been removed or you may not have permission to view it.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostAndComments();
  }, [id]);
  
  const handleLike = async () => {
    if (!currentUser) {
      toast.info('Please log in to like posts');
      return;
    }
    
    try {
      const updatedLikes = await toggleLikePost(id);
      setPost({ ...post, likes: updatedLikes });
    } catch (err) {
      toast.error('Failed to update like status');
      console.error('Error liking post:', err);
    }
  };
  
  const handleBookmark = async () => {
    if (!currentUser) {
      toast.info('Please log in to bookmark posts');
      return;
    }
    
    try {
      const updatedBookmarks = await toggleBookmarkPost(id);
      setPost({ ...post, bookmarks: updatedBookmarks });
    } catch (err) {
      toast.error('Failed to update bookmark status');
      console.error('Error bookmarking post:', err);
    }
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.info('Please log in to comment');
      return;
    }
    
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    try {
      setCommentLoading(true);
      const newComment = await addComment(id, { content: commentText });
      setComments([newComment, ...comments]);
      setCommentText('');
      toast.success('Comment added successfully');
    } catch (err) {
      toast.error('Failed to add comment');
      console.error('Error adding comment:', err);
    } finally {
      setCommentLoading(false);
    }
  };
  
  if (loading) {
    return <Spinner />;
  }
  
  if (error) {
    return (
      <div className="post-error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="post-error-container">
        <h2>Post Not Found</h2>
        <p>The post you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    );
  }
  
  const isLiked = currentUser && post.likes && post.likes.includes(currentUser._id);
  const isBookmarked = currentUser && post.bookmarks && post.bookmarks.includes(currentUser._id);
  const isAuthor = currentUser && post.author._id === currentUser._id;
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="post-detail-container">
      <div className="post-detail">
        <h1 className="post-title">{post.title}</h1>
        
        <div className="post-meta">
          <div className="post-author">
            <Link to={`/profile/${post.author._id}`} className="author-link">
              <div className="author-avatar">
                {post.author.username.charAt(0).toUpperCase()}
              </div>
              <span>{post.author.username}</span>
            </Link>
          </div>
          <div className="post-date">{formatDate(post.createdAt)}</div>
        </div>
        
        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) => (
            paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
          ))}
        </div>
        
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
          <button 
            className={`action-button ${isLiked ? 'active' : ''}`}
            onClick={handleLike}
          >
            <i className={`${isLiked ? 'fas' : 'far'} fa-heart`}></i>
            <span>{post.likes ? post.likes.length : 0}</span>
          </button>
          
          <button 
            className={`action-button ${isBookmarked ? 'active' : ''}`}
            onClick={handleBookmark}
          >
            <i className={`${isBookmarked ? 'fas' : 'far'} fa-bookmark`}></i>
          </button>
          
          {isAuthor && (
            <div className="author-actions">
              <Link to={`/edit-post/${post._id}`} className="edit-button">
                Edit
              </Link>
            </div>
          )}
        </div>
        
        <CommentList postId={post._id} />
      </div>
    </div>
  );
};

export default PostDetail;