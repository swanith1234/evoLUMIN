import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ToolDetails.css';

const ToolDetails = () => {
    const [toolDetails, setToolDetails] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchToolDetails = async () => {
            try {
                console.log('Fetching details for ID:', id);
                const response = await fetch('/data.json'); 

                console.log('Response:', response); 
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Data:', data); 
                console.log(typeof id);

                // Corrected find logic: compare id as a number
                const tool = data.find(tool => {
                    console.log(typeof tool.id);
                    return tool.id === id;
                });

                if (!tool) {
                    throw new Error("Tool not found");
                }

                console.log(tool);
                setToolDetails(tool);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching tool details:', error);
            }
        };

        fetchToolDetails();
    }, [id]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!toolDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="tool-details">
            <h1>{toolDetails.name}</h1>
            <p>{toolDetails.description}</p>
            
            <div className="image-slider">
                {toolDetails.images && toolDetails.images.length > 0 ? (
                    toolDetails.images.map((image, index) => (
                        <img key={index} src={image} alt={`Slide ${index + 1}`} />
                    ))
                ) : (
                    <p>No images available.</p>
                )}
            </div>

            <div className="customer-reviews">
                <h2>Customer Reviews</h2>
                {toolDetails.reviews && toolDetails.reviews.length > 0 ? (
                    <ul>
                        {toolDetails.reviews.map((review, index) => (
                            <li key={index}>
                                <strong>{review.username}:</strong> {review.comment}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No reviews available.</p>
                )}

                <div className="review-bar-graph">
                    <h3>Review Ratings</h3>
                    <div>
                        <span>Good: {toolDetails.reviews.good}</span>
                        <span>Bad: {toolDetails.reviews.bad}</span>
                        <span>Poor: {toolDetails.reviews.poor}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolDetails;
