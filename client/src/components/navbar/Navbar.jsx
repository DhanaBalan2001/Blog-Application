import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth.js';
import './navbar.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Function to get user from localStorage
  const getStoredUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  };
  
  useEffect(() => {
    // Update user state from localStorage
    const updateUserState = () => {
      const storedUser = getStoredUser();
      setUser(storedUser);
      // console.log('Navbar user state updated:', storedUser);
    };
    
    // Initial check
    updateUserState();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', updateUserState);
    
    // Set up a custom event listener for auth changes
    const handleAuthChange = () => {
      updateUserState();
    };
    window.addEventListener('authChange', handleAuthChange);
    
    // Check auth status periodically
    const interval = setInterval(updateUserState, 5000);
    
    return () => {
      window.removeEventListener('storage', updateUserState);
      window.removeEventListener('authChange', handleAuthChange);
      clearInterval(interval);
    };
  }, []);
  
  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
    setIsMenuOpen(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };
  
  // Force re-check auth status when component renders
  useEffect(() => {
    setUser(getStoredUser());
  }, []);
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">BlogApp</span>
        </Link>
        
        <form className="navbar-search" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search posts..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search">🔍</i>
          </button>
        </form>
        
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}>
            {isMenuOpen ? '✕' : '☰'}
          </i>
        </div>
        
        <ul className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
          </li>
          
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/create-post" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Create Post
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </li>
              <li className="nav-item user-greeting">
                <span>Hello, {user.username}</span>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link register-btn" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
