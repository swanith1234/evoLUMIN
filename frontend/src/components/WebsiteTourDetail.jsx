import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./WebsiteTourDetail.css";
import { AuthContext } from "./authContext";

const WebsiteTourDetail = () => {
  const { token, userInfo } = useContext(AuthContext);
  const { name } = useParams();
  const [tour, setTour] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/problem/${name}/${userInfo.user.language}`
        );
        setTour(response.data);
      } catch (error) {
        setError(`Error fetching tour details: ${error.message}`);
        console.error("Error fetching tour details:", error);
      }
    };

    fetchTourDetail();
  }, [name, userInfo.user.language]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!tour) {
    return <div className="loading">Loading...</div>;
  }

  // Choose a random screenshot for the thumbnail
  const thumbnailImage = tour.screenshots[0] || "";

  return (
    <div className="container">
      <h1>{tour.name}</h1>

      {/* Thumbnail Section with Play Icon */}
      <div
        className="thumbnail-container"
        onClick={() => window.open(tour.youtube, "_blank")}
        style={{
          position: "relative",
          cursor: "pointer",
          display: "inline-block",
        }}
      >
        {/* Thumbnail Image */}
        <img
          src={thumbnailImage}
          alt="Thumbnail"
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: "16/7",
          }}
        />

        {/* Play Icon */}
        <div
          className="play-icon"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "64px",
            color: "white",
          }}
        >
          ▶️
        </div>
      </div>

      {/* Clickable Title Below Thumbnail */}
      <h2 className="tool-title">
        <a href={tour.appLink} target="_blank" rel="noopener noreferrer">
          {tour.name} Website
        </a>
      </h2>

      {/* Tool Description */}
      <p className="description">{tour.description}</p>

      <h2>Website Tour Images:</h2>
      <div className="steps">
        {tour.screenshots.map((step, index) => (
          <div key={index} className="step">
            {step && (
              <div className="image-container">
                <img src={step} alt={`Step ${index + 1}`} />
              </div>
            )}
          </div>
        ))}
      </div>

      <h2>How to Use the Website:</h2>
      <div className="instructions">
        {tour.instructions.map((step, index) => (
          <div key={index} className="step-instructions">
            <h3>Step {index + 1}</h3>
            <p>{step.instruction || "No additional details provided."}</p>
          </div>
        ))}
      </div>

      <p>Rating: {tour.rating}</p>
    </div>
  );
};

export default WebsiteTourDetail;
