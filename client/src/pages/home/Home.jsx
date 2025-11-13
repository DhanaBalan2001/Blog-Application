import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../../services/post.js';
import PostCard from '../../components/posts/PostCard.jsx';
import Spinner from '../../components/spinner/Spinner.jsx';
import './home.css';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getAllPosts(currentPage);
        setPosts(response.posts);
        setTotalPages(response.totalPages);
        setLoading(false);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        setLoading(false);
        console.error('Error fetching posts:', err);
      }
    };
    
    fetchPosts();
  }, [currentPage]);
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };
  
  if (loading) {
    return <Spinner />;
  }
  
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to BlogApp</h1>
          <p>Discover stories, thinking, and expertise from writers on any topic.</p>
          <Link to="/create-post" className="cta-button">Start Writing</Link>
        </div>
      </div>
      
      <div className="posts-section">
        <h2>Latest Posts</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {!loading && posts.length === 0 && (
          <div className="no-posts-message">
            <p>No posts found. Be the first to create a post!</p>
            <Link to="/create-post" className="cta-button-secondary">Create Post</Link>
          </div>
        )}
        
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>
            
            <div className="page-numbers">
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number + 1}
                  onClick={() => handlePageChange(number + 1)}
                  className={`page-number ${currentPage === number + 1 ? 'active' : ''}`}
                >
                  {number + 1}
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
