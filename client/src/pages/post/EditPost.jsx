import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getPostById, updatePost, deletePost } from '../../services/post.js';
import { getStoredUser } from '../../services/auth.js';
import Spinner from '../../components/spinner/Spinner.jsx';
import './editpost.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = getStoredUser();
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const post = await getPostById(id);
        
        // Check if current user is the author
        if (!currentUser || post.author._id !== currentUser._id) {
          toast.error('You are not authorized to edit this post');
          navigate(`/posts/${id}`);
          return;
        }
        
        setFormData({
          title: post.title,
          content: post.content,
          tags: post.tags ? post.tags.join(', ') : ''
        });
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. It may have been removed or you may not have permission to edit it.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPost();
  }, [id, navigate, currentUser]);
  
  const { title, content, tags } = formData;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    
    try {
      setSubmitting(true);
      
      // Format tags as array
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      const postData = {
        title,
        content,
        tags: tagsArray
      };
      
      await updatePost(id, postData);
      
      toast.success('Post updated successfully!');
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error(error.message || 'Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        setDeleting(true);
        await deletePost(id);
        toast.success('Post deleted successfully');
        navigate('/');
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error(error.message || 'Failed to delete post');
        setDeleting(false);
      }
    }
  };
  
  if (loading) {
    return <Spinner />;
  }
  
  if (error) {
    return (
      <div className="post-form-container">
        <div className="post-form-card">
          <h2 className="form-title">Error</h2>
          <p className="error-message">{error}</p>
          <button 
            onClick={() => navigate('/')} 
            className="submit-button"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="post-form-container">
      <div className="post-form-card">
        <h2 className="form-title">Edit Post</h2>
        
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={handleChange}
              placeholder="Enter a descriptive title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={handleChange}
              placeholder="Write your post content here..."
              rows="12"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={tags}
              onChange={handleChange}
              placeholder="e.g. technology, programming, web"
            />
            <small className="form-hint">
              Add relevant tags to help others find your post
            </small>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="delete-button"
              onClick={handleDelete}
              disabled={submitting || deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Post'}
            </button>
            
            <div className="right-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate(`/posts/${id}`)}
                disabled={submitting || deleting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={submitting || deleting}
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;