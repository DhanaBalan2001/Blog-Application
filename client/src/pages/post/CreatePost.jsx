import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createPost } from '../../services/post.js';
import { isAuthenticated } from '../../services/auth.js';
import './createpost.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    navigate('/login');
    toast.error('Please log in to create a post');
    return null;
  }
  
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
      setLoading(true);
      
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
      
      const response = await createPost(postData);
      
      toast.success('Post created successfully!');
      navigate(`/posts/${response._id}`);
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error(error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="post-form-container">
      <div className="post-form-card">
        <h2 className="form-title">Create New Post</h2>
        
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
              className="cancel-button"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
