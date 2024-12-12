import React, { useContext } from "react";
import { AuthContext } from "./authContext"; // Import the AuthContext to get the userInfo
import "./Profile.css";

const Profile = () => {
  const { userInfo } = useContext(AuthContext); // Access userInfo from the context

  // Check if userInfo exists and has data to avoid errors if it's null or undefined
  if (!userInfo) {
    return <div>Loading...</div>; // Or any loading state you prefer
  }

  const {
    name,
    role,
    email,
    phone,
    crop,
    cropImage,
    productionStage,
    bookedTools,
    district,
    cropsForSale,
  } = userInfo.user;

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
            src={cropImage || "https://via.placeholder.com/150"} // Default image if no crop image is available
            alt="Profile"
            className="profile-picture"
          />
        </div>
        <div className="profile-details">
          <h2>{name || "Name Not Available"}</h2>
          <p>Role: {role || "Not Specified"}</p>
          <p>Email: {email || "Not Specified"}</p>
          <p>Phone: {phone || "Not Specified"}</p>
          <p>Crop Type: {crop || "Not Specified"}</p>
          <p>Production Stage: {productionStage || "Not Specified"}</p>
          <p>District: {district || "Not Specified"}</p>
          {/* {cropsForSale && cropsForSale.length > 0 && (
            <div>
              <h4>Crops Available for Sale</h4>
              <ul>
                {cropsForSale.map((crop, index) => (
                  <li key={index}>
                    {crop.name} - {crop.quantity} units
                  </li>
                ))}
              </ul>
            </div>
          )} */}
        </div>
      </div>

      {/* Tools Section */}
      {bookedTools && bookedTools.length > 0 && (
        <div className="tools-section ">
          <h3>Tools Booked</h3>
          <div className="tools-grid">
            {bookedTools.map((tool) => (
              <div className="tool-card" key={tool.id}>
                <h4>{tool.toolTitle}</h4>

                <button className="btn-call">Call Supplier</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
