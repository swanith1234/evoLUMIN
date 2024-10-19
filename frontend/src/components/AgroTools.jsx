import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AgroTools.css"; 

const AgroTools = () => {
  const [tools, setTools] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); 

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/toolsData.json"); 
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); 
        setTools(data); 
      } catch (error) {
        setError(error.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchData(); 
  }, []);

 
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="agro-tools-container">
      <h2>Agro Tools</h2>
      <div className="agro-tools-grid">
        {tools.map((tool) => (
          <div key={tool.id} className="tool-card">
            <img src={tool.image} alt={tool.name} className="tool-image" />
            <h3 className="tool-name">{tool.name}</h3>
            <p className="tool-description">{tool.description}</p>
            <p className="booked-users">Booked by: {tool.bookedUsers} users</p>
            <div className="tool-card-actions">
              <button className="call-button" onClick={() => alert(`Calling ${tool.name}`)}>Call</button>
              <button className="view-details-button" onClick={() => navigate(`/tool/${tool.id}`)}>View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgroTools;
