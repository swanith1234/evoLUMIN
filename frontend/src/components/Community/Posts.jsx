import React, { useState } from 'react';
import './Posts.css';

// Modal for creating a post
const PostModal = ({ show, onClose, onCreatePost }) => {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('General');

  if (!show) {
    return null;
  }

  const handlePost = () => {
    onCreatePost({
      user: 'Afroze Mohammad', // Example user
      avatar: 'user-avatar.jpg', // Example avatar
      content,
      postType,
      createdAt: new Date().toLocaleString(),
    });
    setContent('');
    setPostType('General');
    onClose();
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
        ></textarea>
        <div className="modal-footer">
          <button className="modal-button" onClick={handlePost}>
            Post
          </button>
          <select
            className="post-type-dropdown"
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
          >
            <option value="General">General</option>
            <option value="Problem">Problem</option>
          </select>
          <button className="modal-cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Post component to display individual posts
const Post = ({ user, avatar, content, postType, createdAt, media }) => {
  const headerClass = postType === 'Problem' ? 'header-problem' : 'header-general';

  return (
    <div className="post-container">
      <div className={`post-header ${headerClass}`}>
        <img src={avatar} alt="Avatar" className="user-avatar" />
        <div>
          <h3>{user}</h3>
          <span>{createdAt}</span>
        </div>
      </div>
      <p className="post-content">{content}</p>
      {media && <img src={media} alt="Media" className="post-media" />}
      <div className="post-footer">
        <button className="post-action">Like</button>
        <button className="post-action">Comment</button>
        <button className="post-action">Share</button>
      </div>
    </div>
  );
};

// Main Posts component to handle state
const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [media, setMedia] = useState('');

  const addPost = (post) => {
    setPosts([post, ...posts]);
  };

  const handleMediaUpload = (e) => {
    setMedia(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="posts-page-container">
      <div className="posts-container">
        {posts.map((post, index) => (
          <Post key={index} {...post} media={media} />
        ))}

        {/* Sticky input bar at the bottom */}
        <div className="sticky-bar">
          <input
            placeholder="Create a post..."
            className="sticky-input"
            onClick={() => setShowModal(true)}
          />
          <div className="sticky-buttons">
            <label htmlFor="media-upload" className="upload-icon">+</label>
            <input
              type="file"
              id="media-upload"
              style={{ display: 'none' }}
              onChange={handleMediaUpload}
            />
            <button className="sticky-post-button" onClick={() => setShowModal(true)}>
              Post
            </button>
          </div>
        </div>

        {/* Post creation modal */}
        <PostModal show={showModal} onClose={() => setShowModal(false)} onCreatePost={addPost} />
      </div>
    </div>
  );
};

export default Posts;
