import React, { useState, useContext } from "react";
import "./PostModal.css";
import { uploadFile } from "../../upload";
import { AuthContext } from "../authContext";
const PostModal = ({ show, onClose }) => {
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("normal");
  const [media, setMedia] = useState("");
  const [showTypeModal, setShowTypeModal] = useState(false);
  const { token, userInfo } = useContext(AuthContext);
  if (!show) return null;
  const handleMediaChange = async (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    const uploadedMedia = await Promise.all(
      files.map(async (file) => {
        const uploadedFile = await uploadFile(file);
        console.log(uploadedFile);
        return uploadedFile.url; // Extract the URL for each uploaded file
      })
    );

    setMedia((prevMedia) => [...prevMedia, ...uploadedMedia]); // Append new uploads to the existing media array
  };

  const handlePost = async () => {
    if (!content && !media) return;

    // Replace this with the actual user ID or get it from context
    const userId = userInfo.user._id;

    // Define the post data
    const postData = {
      description: content,
      media, // This should ideally be handled with a file upload API or converted to a base64 string
      tag: postType,
      userId,
    };

    try {
      const response = await fetch("http://localhost:3000/api/v1/post", {
        // Adjust URL to your backend endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Post created:", data);

        // Reset form fields and close the modal
        setContent("");
        setPostType("normal");
        setMedia("");
        setShowTypeModal(false);

        // Notify parent component of the new post
        onClose(data.post);
      } else {
        console.error("Failed to create post:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-container">
        <h2 className="modal-header">Create a Post</h2>
        <textarea
          placeholder="What do you want to talk about?"
          className="modal-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {media && <img src={media} alt="Uploaded" className="media-preview" />}
        <label htmlFor="media-upload" className="upload-icon">
          +
        </label>
        <input
          type="file"
          id="media-upload"
          style={{ display: "none" }}
          onChange={handleMediaChange}
        />
        <div className="modal-footer">
          <button className="modal-cancel-button" onClick={() => onClose()}>
            Cancel
          </button>
          <button
            className="modal-button"
            onClick={() => setShowTypeModal(true)}
          >
            Post
          </button>
        </div>
      </div>

      {showTypeModal && (
        <div className="modal-background">
          <div className="submodal-container">
            <h2 className="submodal-header">Select Post Type</h2>
            <select
              className="post-type-dropdown"
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
            >
              <option value="normal">General</option>
              <option value="Problem">Problem</option>
            </select>
            <button className="submodal-confirm-button" onClick={handlePost}>
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostModal;
