import React, { useEffect, useState } from 'react';

const ToolDetails = ({ id }) => {
    const [toolDetails, setToolDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchToolDetails = async () => {
            try {
                console.log('Fetching details for ID:', id);
                const response = await fetch('../../publi/data/data.json'); 

                console.log('Response:', response); 
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Data:', data); 
                
                const tool = data.find(tool => tool.id === id);

                if (!tool) {
                    throw new Error("Tool not found");
                }

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
                        <span>Good: {toolDetails.ratings.good}</span>
                        <span>Bad: {toolDetails.ratings.bad}</span>
                        <span>Poor: {toolDetails.ratings.poor}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolDetails;
