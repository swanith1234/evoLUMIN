import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./AgroTools.css";
import { AuthContext } from "./authContext";
import axios from "axios";

const AgroTools = () => {
  const [stages, setStages] = useState([]); // To store tools grouped by production stages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [crop, setCrop] = useState();
  const [nearbyCounts, setNearbyCounts] = useState({}); // Track nearby user counts
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/tools/${token}`
        );

        const data = response.data.cropDetails;
        setCrop(data.cropName);
        setStages(data.productionStages);

        // Fetch nearby user counts for each tool
        data.productionStages.forEach((stage) => {
          stage.tools.forEach((tool) => {
            fetchNearbyUserCount(tool.title); // Fetch count for each tool
          });
        });
      } catch (error) {
        console.error("Error in fetching tools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Function to fetch nearby user count for a specific tool
  const fetchNearbyUserCount = async (toolTitle) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/tools/nearby/${token}`,
        { params: { toolTitle } } // Send tool ID as query parameter
      );
      setNearbyCounts((prevCounts) => ({
        ...prevCounts,
        [toolTitle]: response.data.count, // Update count for specific tool
      }));
    } catch (error) {
      console.error("Error fetching nearby users count:", error);
    }
  };

  const handleBookTool = async (
    cropName,
    productionStageName,
    title,
    toolId
  ) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/tools/book/${token}`,
        { cropName, productionStageName, title, toolId } // Include toolId in the request
      );
      console.log(response.data);
      alert("Tool booked successfully!");
    } catch (error) {
      console.log("Error booking tool:", error);
      alert("Failed to book the tool. Please try again.");
    }
  };

  const handleCall = (cropName, productionStageName, title) => {
    if (window.confirm("Are you sure you want to call and book this tool?")) {
      handleBookTool(cropName, productionStageName, title);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="agro-tools-container">
      <h2>Agro Tools by Production Stages</h2>
      {stages.map((stage) => (
        <div key={stage._id} className="production-stage">
          <h3>{stage.stageName}</h3>
          <div className="agro-tools-grid">
            {stage.tools.map((tool) => (
              <div key={tool._id} className="tool-card">
                <img
                  src={tool.images[0]}
                  alt={tool.title}
                  className="tool-image"
                />
                <h3 className="tool-name">{tool.title}</h3>
                <p className="tool-description">{tool.description}</p>
                <p className="booked-users">
                  Booked by: {tool.numberOfUsersBooked} users
                </p>
                <p className="nearby-users">
                  Nearby users (10 km): {nearbyCounts[tool._id] || 0} users
                </p>
                <div className="tool-card-actions">
                  <button
                    onClick={
                      () =>
                        handleCall(crop, stage.stageName, tool.title, tool._id) // Ensure tool ID is passed here
                    }
                    className="call-button text-center"
                  >
                    Call
                  </button>
                  <button
                    className="view-details-button"
                    onClick={() =>
                      navigate(`/tool/${crop}/${stage.stageName}/${tool.title}`)
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgroTools;
