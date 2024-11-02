// LocationTracker.js
import { useEffect } from "react";
import socket from "./socket"; // Import singleton socket instance

const LocationTracker = () => {
  useEffect(() => {
    // Connect the socket explicitly when component mounts
    socket.connect();

    const handleLocationUpdate = (position) => {
      const { latitude, longitude, speed, timestamp } = position.coords;
      socket.emit("sendLocation", {
        socketId: socket.id,
        coordinates: { lat: latitude, lng: longitude },
        speed: speed ? (speed * 3.6).toFixed(2) : null,
        timestamp,
      });
    };

    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        handleLocationUpdate,
        (error) => console.error("Error:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
        socket.disconnect(); // Disconnect only when LocationTracker unmounts
      };
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return null;
};

export default LocationTracker;
