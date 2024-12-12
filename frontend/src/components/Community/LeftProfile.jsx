
import React from "react";
import { useState, useEffect, useContext } from "react";
import "./LeftProfile.css";
import farmer from "../../assets/farmer.jpg";
import EditIcon from "@mui/icons-material/Edit";
import { AuthContext } from "../authContext";
import { Link } from "react-router-dom";
const LeftProfile = () => {
  const { token, userInfo } = useContext(AuthContext);
  console.log("user", userInfo);

  return (
    <>
      <div className="left-profile">
        <div className="profile-section">
          <div>
            <img src={farmer} alt="" />
          </div>

          <div className="name">Welcome {userInfo.user.name}!</div>
          <button className="add-photo-btn">
            <EditIcon fontSize="small" /> Add a photo
          </button>
        </div>

        <div className="sections">
          <div className="Myposts">My Posts</div>
          <Link to="/agro-connect/savedPosts">
            {" "}
            <div className="Saved-Posts">
              Saved Posts {userInfo.user.savedPosts.length}
            </div>
          </Link>
          <Link to="/agro-connect/likedPosts">
            {" "}
            <div className="Liked-Posts">
              Liked Posts {userInfo.user.likedPosts.length}
            </div>
          </Link>
          <button className="join">Join Rooms</button>
        </div>
      </div>
    </>
  );
};

export default LeftProfile;
