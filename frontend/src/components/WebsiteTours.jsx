import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./WebsiteTours.css";
import logo from "../assets/logo.png";
const WebsiteTours = () => {
  const [tours, setTours] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch("/data/websiteToursData.json");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTours(data);
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
        console.error("Error fetching data:", error);
      }
    };

    fetchTours();
  }, []);

  const renderStars = (rating) => {
    const totalStars = 5; // Total number of stars to display
    return (
      <div className="star-rating">
        {[...Array(totalStars)].map((_, index) => (
          <span key={index} className={index < rating ? "star filled" : "star"}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="tours-container">
      <h1>Website Tours</h1>
      <div className="tours-grid">
        {tours.map((tour) => (
          <div className="tour-card" key={tour.id}>
            <Link to={`/browse-website/${tour.name}`}>
              <img src={logo} alt={tour.name} className="tour-image" />
              <h2>{tour.name}</h2>
            </Link>
            {renderStars(tour.rating)} {/* Render stars instead of numbers */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebsiteTours;
