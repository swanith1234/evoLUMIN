import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import "./ToolDetails.css";
import axios from "axios";

const ToolDetails = () => {
  const [toolDetails, setToolDetails] = useState(null);
  const [error, setError] = useState(null);
  const { crop, productionStage, title } = useParams();

  useEffect(() => {
    const fetchToolDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/tools/${crop}/${productionStage}/${title}`
        );
        const tool = response.data.tool;
        setToolDetails(tool);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchToolDetails();
  }, [title]);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1); // Average rating with one decimal
  };

  const getRatingDistribution = (reviews) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!toolDetails) {
    return <div>Loading...</div>;
  }

  const averageRating = calculateAverageRating(toolDetails.reviews);
  const ratingDistribution = getRatingDistribution(toolDetails.reviews);

  return (
    <div className="tool-details">
      {/* Image Carousel */}
      <div className="product-image">
        {toolDetails.images && toolDetails.images.length > 0 ? (
          <Carousel
            showArrows={true}
            autoPlay={true}
            infiniteLoop={true}
            showThumbs={false}
            showStatus={false}
          >
            {toolDetails.images.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </Carousel>
        ) : (
          <p>No images available.</p>
        )}
      </div>

      <div className="product-rating flex justify-between">
        <div>
          {" "}
          <h1 className="text-2xl font-semibold text-slate-500">
            {toolDetails.title}
          </h1>
          <p>{toolDetails.description}</p>
        </div>
        <div className="star-rating">
          {[...Array(5)].map((star, index) => {
            const ratingValue = index + 1;
            return (
              <span
                key={index}
                className={
                  ratingValue <= averageRating ? "filled-star" : "empty-star"
                }
              >
                ★
              </span>
            );
          })}
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
                    (ratingDistribution[rating] / toolDetails.reviews.length) *
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
                        starIndex < review.rating ? "filled-star" : "empty-star"
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
    </div>
  );
};

export default ToolDetails;
