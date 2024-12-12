import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion"; // Importing Framer Motion
import "./Retail.css";
import { AuthContext } from "./authContext";
import Logo from '../assets/logo.png'

const Retailer = () => {
  const { token, userInfo } = useContext(AuthContext);
  const [cropType, setCropType] = useState("Paddy");
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(false);

  const cropTypes = ["Paddy", "Brinjal", "Wheat", "Maize", "Tomato"];

  useEffect(() => {
    const fetchCrops = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/getCropDetailsByType/${cropType}`
        );
        const data = await response.json();
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

  const handleInterest = async (cropTitle, userId) => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/notifyFarmer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cropTitle,
          userId,
          id: userInfo.user.phone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("The farmer has been notified!");
        setCrops((prevCrops) =>
          prevCrops.map((crop) =>
            crop.title === cropTitle
              ? { ...crop, mediator: [...crop.mediator, userInfo.user.phone] }
              : crop
          )
        );
      } else {
        alert(data.message || "Failed to notify the farmer.");
      }
    } catch (error) {
      console.error("Error notifying farmer:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="retailer-container">
      <aside className="sidebar">
        <div className="logo-container">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={Logo}
              alt="Logo Placeholder"
              className="logo"
            />
          </motion.div>
        </div>
        <h2>Crop Types</h2>
        <ul className="crop-list">
          {cropTypes.map((type) => (
            <motion.li
              key={type}
              className={type === cropType ? "active" : ""}
              whileHover={{ scale: 1.1 }}
              onClick={() => setCropType(type)}
            >
              {type}
            </motion.li>
          ))}
        </ul>
      </aside>
      <main className="crop-display">
        <h4>
          Agro Market is a one-stop where you can find the best prices for crops
          nearby and purchase directly from farmers.
        </h4>
        <h2>{cropType} Crops for Sale</h2>
        {loading ? (
          <p>Loading...</p>
        ) : crops.length > 0 ? (
          <motion.div
            className="card-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {crops.map((crop, index) => (
              <motion.div
                key={index}
                className="crop-card"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
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
                    onClick={() => handleInterest(crop.title, crop.userId)}
                    disabled={
                      crop.mediators &&
                      userInfo?.user?.phone &&
                      crop.mediators.some((mediator) =>
                        mediator.includes(userInfo.user.phone)
                      )
                    }
                  >
                    {crop.mediators &&
                    userInfo?.user?.phone  &&
  
                    crop.mediators.some((mediator) =>
                      mediator.includes(userInfo.user.phone)
                    )
                      ? "Notified"
                      : "Notify"}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p>No crops available for {cropType}.</p>
        )}
      </main>
    </div>
  );
};

export default Retailer;
