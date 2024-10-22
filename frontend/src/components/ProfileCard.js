import React from 'react';
import './ProfileCard.css';

const ProfileCard = () => {
  return (
    <div className="profile-card">
      <div className="header-background"></div>
      <div className="profile-info">
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Profile"
          className="profile-image"
        />
        <h2>Emma Smith</h2>
        <p>Software Engineer</p>
        <p>Los Angeles, California</p>

        <div className="button-group">
          <button className="edit-button">Edit Profile</button>
          <button className="settings-button">Settings</button>
        </div>

        <div className="current-role">
          <p>Current role</p>
          <span>Software Engineer</span>
        </div>

        <div className="skills">
          <span className="skill-badge">HTML</span>
          <span className="skill-badge">CSS</span>
          <span className="skill-badge">Dart</span>
          <span className="skill-badge">C++</span>
          <span className="skill-badge">UI Design</span>
        </div>

        <div className="action-buttons">
          <button>Ready for work</button>
          <button>Share posts</button>
          <button>Update</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
