// // src/components/GetStartedButton.jsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
// <style>

// .get-started-button {
//   background-color: #28a745;
//   color: white;
//   padding: 0.5rem 1.5rem;
//   font-size: 1rem;
//   font-weight: bold;
//   border: none;
//   border-radius: 5px;
//   cursor: pointer;
//   transition: background-color 0.3s ease;
// }

// .get-started-button:hover {
//   background-color: #218838;
// }

// </style>
// const GetStartedButton = () => {
//   const navigate = useNavigate(); // Initialize useNavigate

//   const handleClick = () => {
//     navigate('/auth'); // Navigate to the auth page
//   };

//   return (
//     <button
//       onClick={handleClick}
//       className="bg-yellow-500 text-white px-2 py-1 rounded" // Adjusted padding for a smaller button
//     >
//       Get Started
//     </button>
//   );
// };

// export default GetStartedButton;

// src/components/GetStartedButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const GetStartedButton = () => {
  const navigate = useNavigate();

  const buttonStyles = {
    backgroundColor: "#28a745",
    color: "white",
    padding: "0.5rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const handleClick = () => {
    navigate("/auth");
  };

  return (
    <button
      onClick={handleClick}
      style={buttonStyles}
      onMouseEnter={(e) => (e.target.style.backgroundColor = "#218838")}
      onMouseLeave={(e) => (e.target.style.backgroundColor = "#28a745")}
    >
      Get Started
    </button>
  );
};

export default GetStartedButton;
