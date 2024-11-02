import React, { useState } from "react";
import "./Posts.css";

const PostModal = ({ show, onClose }) => {
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("General");
  const [media, setMedia] = useState("");

  if (!show) return null;

  const handlePost = () => {
    if (!content && !media) return;

    const newPost = {
      user: "Afroze Mohammad",
      avatar: "user-avatar.jpg",
      content,
      postType,
      createdAt: new Date().toLocaleString(),
      media,
    };

    onClose(newPost);
    setContent("");
    setPostType("General");
    setMedia("");
  };

  const handleMediaUpload = (e) => {
    setMedia(URL.createObjectURL(e.target.files[0]));
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
        <label htmlFor="media-upload" className="upload-icon">
          +
        </label>
        <input
          type="file"
          id="media-upload"
          style={{ display: "none" }}
          onChange={handleMediaUpload}
        />
        <div className="modal-footer">
          <button className="modal-cancel-button" onClick={onClose}>
            Cancel
          </button>
          <select
            className="post-type-dropdown"
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
          >
            <option value="General">General</option>
            <option value="Problem">Problem</option>
          </select>
          <button className="modal-button" onClick={handlePost}>
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
