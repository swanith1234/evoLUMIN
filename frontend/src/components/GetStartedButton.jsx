// src/components/GetStartedButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory

const GetStartedButton = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleClick = () => {
    navigate('/auth'); // Navigate to the auth page
  };

  return (
    <button 
      onClick={handleClick} 
      className="bg-yellow-500 text-white px-2 py-1 rounded" // Adjusted padding for a smaller button
    >
      Get Started
    </button>
  );
};

export default GetStartedButton;
