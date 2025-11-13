import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { searchPosts } from '../../services/post.js';
import PostCard from '../../components/posts/PostCard.jsx';
import Spinner from '../../components/spinner/Spinner.jsx';
import './searchresults.css';

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query') || '';
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setPosts([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const results = await searchPosts(query);
        setPosts(results);
      } catch (err) {
        console.error('Error searching posts:', err);
        setError('Failed to load search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]);
  
  if (loading) {
    return <Spinner />;
  }
  
  return (
    <div className="search-results-container">
      <div className="search-header">
        <h1>Search Results</h1>
        <p className="search-query">
          {query ? `Showing results for "${query}"` : 'Please enter a search term'}
        </p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {!loading && !error && (
        <div className="search-results">
          {posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No posts found matching your search.</p>
              <div className="search-suggestions">
                <h3>Suggestions:</h3>
                <ul>
                  <li>Check your spelling</li>
                  <li>Try more general keywords</li>
                  <li>Try different keywords</li>
                </ul>
              </div>
              <Link to="/" className="back-to-home">
                Back to Home
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
