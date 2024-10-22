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
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("hello", token);
        const response = await axios.get(
          `http://localhost:3000/api/v1/tools/${token}`
        );
        console.log(response);

        const data = response.data.cropDetails;
        console.log(data);
        setCrop(data.cropName);
        setStages(data.productionStages); // Set the production stages and their tools
      } catch (error) {
        console.log("error in fetching", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

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
                <div className="tool-card-actions">
                  <a href="tel:9347562927" className="call-button text-center">
                    {" "}
                    <button onClick={() => alert(`Calling ${tool.title}`)}>
                      Call
                    </button>
                  </a>
                  <button
                    className="view-details-button"
                    onClick={
                      () =>
                        navigate(
                          `/tool/${crop}/${stage.stageName}/${tool.title}`
                        ) // Use stage.stageName
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
