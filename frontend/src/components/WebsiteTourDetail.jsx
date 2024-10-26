import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./WebsiteTourDetail.css";

const WebsiteTourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        const response = await fetch("/data/websiteToursData.json");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const selectedTour = data.find((tour) => tour.id === parseInt(id));
        setTour(selectedTour);
      } catch (error) {
        setError(`Error fetching tour details: ${error.message}`);
        console.error("Error fetching tour details:", error);
      }
    };

    fetchTourDetail();
  }, [id]);

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!tour) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>{tour.name}</h1>
      
      {/* Video Section */}
      <iframe
        src={tour.video.replace("watch?v=", "embed/")}
        title={tour.name}
        frameBorder="0"
        allowFullScreen
      ></iframe>

      {/* Clickable Title Below Video */}
      <h2 className="tool-title">
        <a href={tour.websiteUrl} target="_blank" rel="noopener noreferrer">
          {tour.name} Website
        </a>
      </h2>

      {/* Tool Description */}
      <p className="description">{tour.description}</p>

      <h2>Website Tour Images:</h2>
      <div className="steps">
        {tour.instructions.map((step, index) => (
          <div key={index} className="step">
            {/* Image only in the card */}
            {step.image && (
              <div className="image-container">
                <img src={step.image} alt={step.title} />
              </div>
            )}
          </div>
        ))}
      </div>

      <h2>How to Use the Website:</h2>
      <div className="instructions">
        {tour.instructions.map((step, index) => (
          <div key={index} className="step-instructions">
            <h3>Step {index + 1}: {step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>

      <p>Rating: {tour.rating}</p>
    </div>
  );
};

export default WebsiteTourDetail;
