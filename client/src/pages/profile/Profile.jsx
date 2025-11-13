import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getUserById, updateUserProfile, getUserPosts, followUser, unfollowUser, getUserFollowers, getUserFollowing, updateProfilePictureUrl} from '../../services/user.js';
import { isAuthenticated, getCurrentUser, getStoredUser } from '../../services/auth.js';
import { toast } from 'react-toastify';
import Spinner from '../../components/spinner/Spinner.jsx';
import PostCard from '../../components/posts/PostCard.jsx';
import ProfileImage from './ProfileImage.jsx';
import './profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: ''
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Determine if we're viewing the current user's profile or someone else's
  const isCurrentUserProfile = !id;
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        // If no ID in URL, fetch current user's profile
        if (!id) {
          // Check if user is authenticated
          if (!isAuthenticated()) {
            navigate('/login');
            return;
          }
          
          // Fetch current user profile
          const userData = await getCurrentUser();
          setUser(userData);
          
          // Initialize form data with current user data
          setFormData({
            username: userData.username || '',
            bio: userData.bio || ''
          });
          
          // Fetch followers and following
          try {
            const followersData = await getUserFollowers(userData._id);
            const followingData = await getUserFollowing(userData._id);
            setFollowers(followersData);
            setFollowing(followingData);
            setFollowersCount(followersData.length);
            setFollowingCount(followingData.length);
          } catch (err) {
            console.error('Error fetching followers/following:', err);
          }
          
          // Fetch user's posts
          try {
            const userPosts = await getUserPosts(userData._id);
            setPosts(userPosts);
          } catch (postErr) {
            console.error('Error fetching user posts:', postErr);
          }
        } else {
          // Fetch profile by ID
          const userData = await getUserById(id);
          setUser(userData);
          
          // Check if current user is following this user
          if (isAuthenticated()) {
            try {
              const currentUser = await getCurrentUser();
              // Check if the current user is following the profile user
              setIsFollowing(currentUser.following && currentUser.following.some(
                followingId => followingId === id || followingId._id === id
              ));
            } catch (err) {
              console.error('Error checking follow status:', err);
            }
          }
          
          // Fetch followers and following
          try {
            const followersData = await getUserFollowers(id);
            const followingData = await getUserFollowing(id);
            setFollowers(followersData);
            setFollowing(followingData);
            setFollowersCount(followersData.length);
            setFollowingCount(followingData.length);
          } catch (err) {
            console.error('Error fetching followers/following:', err);
          }
          
          // Fetch user's posts
          try {
            const userPosts = await getUserPosts(id);
            setPosts(userPosts);
          } catch (postErr) {
            console.error('Error fetching user posts:', postErr);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to fetch user profile');
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [id, navigate]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('profileImage', imageFile);
      
      const response = await updateProfilePictureUrl(formData);
      
      // Update user state with new profile image
      setUser({
        ...user,
        profilePicture: response.profilePicture
      });
      
      // Update stored user data
      const storedUser = getStoredUser();
      if (storedUser) {
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          profilePicture: response.profilePicture
        }));
        
        // Trigger storage event for navbar update
        window.dispatchEvent(new Event('storage'));
      }
      
      setImageFile(null);
      toast.success('Profile image updated successfully');
    } catch (err) {
      console.error('Error uploading profile image:', err);
      toast.error(err.message || 'Failed to upload profile image');
    } finally {
      setUploading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const updatedUser = await updateUserProfile(formData);
      setUser({ ...user, ...updatedUser });
      
      // Update stored user data
      const storedUser = getStoredUser();
      if (storedUser) {
        localStorage.setItem('user', JSON.stringify({
          ...storedUser,
          username: updatedUser.username,
          bio: updatedUser.bio
        }));
        
        // Trigger storage event for navbar update
        window.dispatchEvent(new Event('storage'));
      }
      
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.message || 'Failed to update profile');
    }
  };
  
  const handleFollowToggle = async () => {
    if (!isAuthenticated()) {
      toast.error('Please log in to follow users');
      navigate('/login');
      return;
    }
    
    try {
      if (isFollowing) {
        await unfollowUser(id);
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
        toast.success(`Unfollowed ${user.username}`);
      } else {
        await followUser(id);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        toast.success(`Following ${user.username}`);
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
      toast.error(err.message || 'Failed to follow/unfollow user');
    }
  };
  
  if (loading) {
    return <Spinner />;
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>User not found</p>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="profile-container">
      <div className="profile-header">
        {isCurrentUserProfile ? (
          <ProfileImage user={user} setUser={setUser} />
        ) : (
          <div className="profile-avatar">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.username}'s profile`}
                className="profile-image"
              />
            ) : (
              <div className="avatar-placeholder">
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-edit-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="3"
                placeholder="Tell us about yourself"
              ></textarea>
            </div>
            
            <div className="profile-edit-actions">
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button type="submit" className="save-button">
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <h1 className="profile-username">{user.username}</h1>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
            
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{posts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat">
                <span className="stat-value">{followersCount}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-value">{followingCount}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
            
            <div className="profile-actions">
              {isCurrentUserProfile ? (
                <button 
                  className="edit-profile-button"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              ) : isAuthenticated() && (
                <button 
                  className={`follow-button ${isFollowing ? 'following' : ''}`}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="profile-content">
        <h2 className="section-title">
          {isCurrentUserProfile ? 'Your Posts' : `${user.username}'s Posts`}
        </h2>
        
        {posts.length > 0 ? (
          <div className="profile-posts">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="no-posts">
            <p>
              {isCurrentUserProfile 
                ? "You haven't created any posts yet." 
                : `${user.username} hasn't created any posts yet.`}
            </p>
            
            {isCurrentUserProfile && (
              <Link to="/create-post" className="create-post-button">
                Create Your First Post
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;