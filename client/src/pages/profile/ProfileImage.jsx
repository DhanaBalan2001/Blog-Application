import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { updateProfilePictureUrl } from '../../services/user.js';
import { getStoredUser } from '../../services/auth.js';
import './profileimage.css';

const ProfileImage = ({ user, setUser }) => {
  const [pictureUrl, setPictureUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  const handleUrlChange = (e) => {
    setPictureUrl(e.target.value);
  };
  
  const handleUpload = async () => {
    if (!pictureUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }
    
    try {
      setUpdating(true);
      
      // For debugging
      console.log('Sending URL:', pictureUrl);
      
      // Call the API to update the profile picture URL
      const response = await updateProfilePictureUrl(pictureUrl.trim());
      
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
      
      setPictureUrl('');
      setShowUrlInput(false);
      toast.success('Profile picture updated successfully');
    } catch (err) {
      console.error('Error updating profile picture:', err);
      toast.error(err.message || 'Failed to update profile picture');
    } finally {
      setUpdating(false);
    }
  };
  
  const toggleUrlInput = () => {
    setShowUrlInput(!showUrlInput);
    if (!showUrlInput) {
      setPictureUrl('');
    }
  };
  
  return (
    <div className="profile-image-container">
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
        
        <button 
          className="change-photo-button"
          onClick={toggleUrlInput}
        >
          Change Photo
        </button>
      </div>
      
      {showUrlInput && (
        <div className="url-input-container">
          <div className="form-group">
            <label htmlFor="pictureUrl">Image URL</label>
            <input
              type="url"
              id="pictureUrl"
              value={pictureUrl}
              onChange={handleUrlChange}
              placeholder="Enter the URL of your profile image"
              className="url-input"
            />
            <small className="form-hint">
              Enter a direct link to an image (JPG, PNG, GIF)
            </small>
          </div>
          
          <div className="url-actions">
            <button 
              onClick={() => setShowUrlInput(false)}
              className="cancel-button"
              disabled={updating}
            >
              Cancel
            </button>
            <button 
              onClick={handleUpload}
              className="update-button"
              disabled={updating || !pictureUrl.trim()}
            >
              {updating ? 'Updating...' : 'Update Picture'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;