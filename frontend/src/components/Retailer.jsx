import React, { useState, useEffect } from "react";
import "./Retail.css";

const Retailer = () => {
  const [cropType, setCropType] = useState("Paddy"); // Default crop type
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);

  const cropTypes = ["Paddy", "Brinjal", "Wheat", "Maize", "Tomato"]; // Sidebar links

  // Fetch crops for sale based on selected crop type
  useEffect(() => {
    const fetchCrops = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/getCropDetailsByType/${cropType}`
        );
        const data = await response.json();
        console.log("Fetched Data:", data);
        if (data.success) {
          setCrops(data.crops);
        } else {
          setCrops([]);
        }
      } catch (error) {
        console.error("Error fetching crops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCrops();
  }, [cropType]);

  // Handle "Interested" button click
  const handleInterest = async (cropId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/notifyFarmer/${cropId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        alert(
          `The farmer has been notified of your interest in their crop!`
        );
      } else {
        alert("Failed to notify the farmer. Please try again.");
      }
    } catch (error) {
      console.error("Error notifying farmer:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="crop-page">
      <aside className="sidebar">
        <h2>Crop Types</h2>
        <ul>
          {cropTypes.map((type) => (
            <li
              key={type}
              className={type === cropType ? "active" : ""}
              onClick={() => setCropType(type)}
            >
              {type}
            </li>
          ))}
        </ul>
      </aside>
      <main className="crop-display">
        <h2>{cropType} Crops for Sale</h2>
        {loading ? (
          <p>Loading...</p>
        ) : crops.length > 0 ? (
          <div className="card-container">
            {crops.map((crop, index) => (
              <div className="crop-card" key={index}>
                <div className="crop-img-box">
                {crop.images && crop.images.length > 0 ? (
                  crop.images.map((img, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={img}
                      alt={`${crop.title} image ${imgIndex + 1}`}
                      className="crop-image"
                    />
                  ))
                ) : (
                  <p>No images available</p>
                )}
                </div>
                <h3>{crop.title}</h3>
                <p>{crop.description}</p>
                <p>Quantity: {crop.quantity}</p>
                <p>Price: ₹{crop.price}</p>
                <p>Seller: {crop.userName}</p>
                <p>Location: {crop.userLocation}</p>
                <div className="interested">
                <button
                  className="interested-btn"
                  onClick={() => handleInterest(crop._id)}
                >
                  Interested
                </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No crops available for {cropType}.</p>
        )}
      </main>
    </div>
  );
};

export default Retailer;