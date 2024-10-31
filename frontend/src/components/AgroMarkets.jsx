// frontend/src/components/AgroMarkets.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AgroMarkets.css";
import { uploadFile } from "../upload";

const AgroMarkets = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    crop: "",
    quantity: "",
    images: "",
  });
  const [posts, setPosts] = useState([]);

  const toggleForm = () => setShowForm(!showForm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const uploadphoto = await uploadFile(file);
    console.log("Uploaded Image:", uploadphoto);
    setFormData({ ...formData, images: uploadphoto.secure_url });
  };

  // const handleVideoChange = async (e) => {
  //   const file = e.target.files[0];
  //   const uploadphoto = await uploadFile(file);
  //   console.log("Uploaded Video:", uploadphoto);
  //   setFormData({ ...formData, video: uploadphoto.playback_url });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/postCrop/${localStorage.getItem(
          "token"
        )}`,
        formData
      );
      setPosts([...posts, response.data.cropDetails]);
      setFormData({ crop: "", quantity: "", images: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error uploading crop details:", error);
    }
  };

  useEffect(() => {
    const fetchCropData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/v1/getCropDetails/${token}`
        );
        setPosts(response.data.cropDetails ? [response.data.cropDetails] : []);
      } catch (error) {
        console.error("Error fetching crop details:", error);
      }
    };

    fetchCropData();
  }, []);

  return (
    <div className="agro-market-container">
      <h1>Agro Market</h1>
      <p>
        A farmer can list crop details such as type, quantity, and price.
        Interested retailers can view listings and directly contact the farmer
        to discuss purchasing options.
      </p>
      <button onClick={toggleForm} className="new-post-btn">
        New Post
      </button>

      {showForm && (
        <div className="modal-overlay" onClick={toggleForm}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            className="post-form"
          >
            <input
              type="text"
              name="crop"
              placeholder="Crop Type"
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
            <label>Upload Image</label>
            <input type="file" onChange={handleImageChange} required />
            <label>Upload Video</label>
            {/* <input type="file" onChange={handleVideoChange} accept="video/*" /> */}
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
      )}

      <div className="posts-container">
        {posts.map((post, index) => (
          <div key={index} className="post-card">
            <img src={post.cropImage} alt="Crop" className="crop-image" />
            <div className="post-details">
              <h3>{post.crop}</h3>
              <p>Quantity: {post.cropQuantityForSale}</p>
              {/* {post.cropVideo && (
                <video src={post.cropVideo} controls className="video-player" />
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgroMarkets;
