import React from 'react';
import './Profile.css';

const Profile = () => {
  const toolsBooked = [
    { id: 1, name: 'Tractor', description: 'Heavy-duty tractor for farming' },
    { id: 2, name: 'Plough', description: 'Essential for soil tillage' },
    { id: 3, name: 'Seeder', description: 'Seed planting machine' },
    { id: 4, name: 'Harvester', description: 'Used for harvesting crops' },
    { id: 5, name: 'Irrigation Kit', description: 'Irrigation tools set' },
    { id: 6, name: 'Drone', description: 'Agriculture drone for crop monitoring' },
  ];

  return (
    <div className="profile-page">
      {/* Cover Photo */}
      <div className="cover-photo">
        <img
          src="https://via.placeholder.com/1200x400" // Placeholder cover photo
          alt="Cover"
          className="cover-photo-img"
        />
      </div>

      {/* Profile Information */}
      <div className="profile-info">
        <div className="profile-left">
          <img
            src="https://via.placeholder.com/150" // Placeholder profile picture
            alt="Profile"
            className="profile-picture"
          />
        </div>
        <div className="profile-details">
          <h2>Supriya</h2>
          <p>Role: Farmer</p>
          <p>Email: supriya@example.com</p>
          <p>Phone: +1234567890</p>
          <p>Crop Type: Organic Vegetables</p>
          <p>Production Stage: Harvesting</p>
        </div>
      </div>

      {/* Tools Section */}
      <div className="tools-section">
        <h3>Tools Booked</h3>
        <div className="tools-grid">
          {toolsBooked.map((tool) => (
            <div className="tool-card" key={tool.id}>
              <h4>{tool.name}</h4>
              <p>{tool.description}</p>
              <button className="btn-call">Call Supplier</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
