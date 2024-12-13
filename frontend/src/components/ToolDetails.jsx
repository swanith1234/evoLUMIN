import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { io } from "socket.io-client";
import socket from "./socket";
import Loader from "./Loader";
import "./ToolDetails.css";

const ToolDetails = () => {
  const [toolDetails, setToolDetails] = useState(null);
  const [locations, setLocations] = useState({});
  const [locationDetails, setLocationDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { crop, productionStage, title } = useParams();

  useEffect(() => {
    const fetchToolDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/tools/${crop}/${productionStage}/${title}`
        );
        const tool = response.data.tool;
        setToolDetails(tool);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    fetchToolDetails();
  }, [crop, productionStage, title]);

  useEffect(() => {
    // Fetch existing locations when the component mounts
    socket.on("existingLocations", (existingLocations) => {
      console.log("Existing locations received:", existingLocations);
      setLocations(existingLocations);
    });

    // Listen for location updates from other clients
    socket.on("locationUpdate", (locationData) => {
      console.log("Location update received:", locationData);
      setLocations((prevLocations) => ({
        ...prevLocations,
        ...locationData, // Merge new data with previous locations
      }));
    });

    // Cleanup on component unmount
    return () => {
      socket.off("existingLocations");
      socket.off("locationUpdate");
    };
  }, []);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = (reviews) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };

  const addRandomOffset = (coordinates) => {
    console.log("ssss", Math.random());
    const offset = 0.0001; // Offset value for separation
    return {
      lat: coordinates.lat + (Math.random() - 0.5) * offset,
      lng: coordinates.lng + (Math.random() - 0.5) * offset,
    };
  };

  if (error) return <div>Error: {error}</div>;
  if (!toolDetails) return <div>Loading...</div>;

  const averageRating = calculateAverageRating(toolDetails.reviews);
  const ratingDistribution = getRatingDistribution(toolDetails.reviews);
  const icon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    color: "#222",
  });

  return (
    <>
      {console.log("body", locations)}
      {loading && <Loader show={loading} />}
      <div className="tool-details">
        <div className="product-image">
          {toolDetails.images ? (
            <Carousel showArrows autoPlay infiniteLoop>
              {toolDetails.images.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`Slide ${index + 1}`} />
                </div>
              ))}
            </Carousel>
          ) : (
            <p>No images available to show.</p>
          )}
        </div>

        <div className="product-rating flex justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-500">
              {toolDetails.title}
            </h1>
            <p>{toolDetails.description}</p>
          </div>
          <div className="star-rating">
            {[...Array(5)].map((star, index) => (
              <span
                key={index}
                className={index < averageRating ? "filled-star" : "empty-star"}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <div className="rating-distribution">
          <h3>Rating Distribution</h3>
          {Object.keys(ratingDistribution).map((rating) => (
            <div key={rating} className="rating-row">
              <span>{rating} star</span>
              <div className="progress-bar">
                <div
                  className="filled-bar"
                  style={{
                    width: `${
                      (ratingDistribution[rating] /
                        toolDetails.reviews.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <span>{ratingDistribution[rating]}</span>
            </div>
          ))}
        </div>

        <div className="customer-reviews">
          <h2>Customer Reviews</h2>
          {toolDetails.reviews && toolDetails.reviews.length > 0 ? (
            <ul>
              {toolDetails.reviews.map((review, index) => (
                <li key={index}>
                  <strong>User {review.userId}:</strong> {review.comment}
                  <div className="review-rating">
                    {[...Array(5)].map((star, starIndex) => (
                      <span
                        key={starIndex}
                        className={
                          starIndex < review.rating
                            ? "filled-star"
                            : "empty-star"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reviews available.</p>
          )}
        </div>

        <div className="map-container">
          <h2>Real-Time Location Tracking</h2>
          {Object.keys(locations).length > 0 ? (
            <MapContainer
              center={Object.values(locations)[0].coordinates}
              zoom={13}
              style={{ height: "400px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              />
              {Object.keys(locations).map((socketId) => {
                const { coordinates } = locations[socketId];
                const offsetCoordinates = addRandomOffset(coordinates);
                return (
                  <>
                    {console.log("swanith", document.querySelector("Marker"))}

                    <Marker
                      key={socketId}
                      position={offsetCoordinates}
                      icon={icon}
                    >
                      <Popup>Socket ID: {socketId}</Popup>
                    </Marker>
                  </>
                );
              })}
            </MapContainer>
          ) : (
            <p>Loading locations...</p>
          )}
          {locationDetails && (
            <div className="location-details">
              <p>
                <strong>Speed:</strong>{" "}
                {locationDetails.speed
                  ? `${locationDetails.speed} km/h`
                  : "N/A"}
              </p>
              <p>
                <strong>Timestamp:</strong> {locationDetails.timestamp}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ToolDetails;
