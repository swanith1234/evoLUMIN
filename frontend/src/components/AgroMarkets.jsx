// Import necessary hooks and modules
import React, { useState } from "react";
import "./AgroMarkets.css";

const AgroMarkets = () => {
  // State variables for form visibility, form data, and posts
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    crop: "",
    quantity: "",
    images: [],
    video: null,
  });
  const [posts, setPosts] = useState([]);

  // Toggle form visibility
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    setFormData({ ...formData, images: [...e.target.files] });
  };

  // Handle video upload
  const handleVideoChange = (e) => {
    setFormData({ ...formData, video: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setPosts([...posts, formData]);
    setFormData({
      name: "",
      location: "",
      crop: "",
      quantity: "",
      images: [],
      video: null,
    });
    console.log("form", formData);
    setShowForm(false);
  };

  return (
    <div className="agro-market-container">
      <h1>Agro Market</h1>
      <button onClick={toggleForm} className="new-post-btn">
        New Post
      </button>

      {/* Display form when showForm is true */}
      {showForm && (
        <form onSubmit={handleSubmit} className="post-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="crop"
            placeholder="Crop"
            value={formData.crop}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
          <label>Upload Images</label>
          <input type="file" multiple onChange={handleImageChange} required />
          <label>Upload Video</label>
          <input
            type="file"
            onChange={handleVideoChange}
            accept="video/*"
            required
          />
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      )}

      {/* Display submitted posts */}
      <div className="posts-container">
        {posts.map((post, index) => (
          <div key={index} className="post-card">
            <div className="collage">
              {post.images.map((image, idx) => (
                <img key={idx} src={URL.createObjectURL(image)} alt="Crop" />
              ))}
            </div>
            <div className="post-details">
              <h3>{post.name}</h3>
              <p>Location: {post.location}</p>
              <p>Crop: {post.crop}</p>
              <p>Quantity: {post.quantity}</p>
              <button
                onClick={() => window.open(URL.createObjectURL(post.video))}
                className="video-btn"
              >
                Watch Video
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgroMarkets;
