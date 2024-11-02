import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import "./LeftProfile.css";
import farmer from "../../assets/farmer.jpg";

const LeftProfile = () => {
  const [user, setUser] = useState({
    name: "Srinu",
    profilePic: "../../assets/farmer",
  });

  useEffect(() => {
    // Fetch user data if necessary
  }, []);

  return (
    <div className="left-profile">
      {/* Profile Section */}
      <div className="profile-section">
        <Avatar
          alt={user.name}
          src={user.profilePic}
          className="profile-avatar"
        />
        <div className="profile-welcome">
          <h2>{`Welcome, ${user.name}!`}</h2>
          <button className="add-photo-btn">
            <EditIcon fontSize="small" /> Add a photo
          </button>
        </div>
      </div>

      <hr className="divider" />

      {/* Links Section */}
      <div className="profile-links">
        <a href="/my-posts">My Posts</a>
        <a href="/saved-posts">Saved Posts</a>
        <a href="/liked-posts">Liked Posts</a>
      </div>
    </div>
  );
};

export default LeftProfile;
