import React, { useState, useContext } from "react";
import "./PostModal.css";
import { uploadFile } from "../../upload";
import { AuthContext } from "../authContext";
const PostModal = ({ show, onClose, onCreatePost }) => {
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

    const postData = {
      description: content,
      media,
      tag: postType,
      userId: userInfo.user._id,
    };

    try {
      const response = await fetch("http://localhost:3000/api/v1/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.post) {
          // Assuming `data.post` contains the newly created post
          onClose(data.post); // Passing the correct post object
        }
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
              <option value="problem">Problem</option>
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
