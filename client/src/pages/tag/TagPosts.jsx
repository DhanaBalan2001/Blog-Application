import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostsByTag } from '../../services/post.js';
import PostCard from '../../components/posts/PostCard.jsx';
import Spinner from '../../components/spinner/Spinner.jsx';
import './tagposts.css';

const TagPosts = () => {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPostsByTag = async () => {
      try {
        setLoading(true);
        const data = await getPostsByTag(tag);
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts by tag:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostsByTag();
  }, [tag]);
  
  if (loading) {
    return <Spinner />;
  }
  
  return (
    <div className="tag-posts-container">
      <div className="tag-header">
        <h1>Posts tagged with <span className="highlight">#{tag}</span></h1>
        <p className="tag-description">
          Showing all posts related to this topic
        </p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {!loading && !error && (
        <div className="tag-results">
          {posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="no-posts">
              <p>No posts found with the tag "#{tag}".</p>
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

export default TagPosts;
