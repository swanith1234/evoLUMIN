import React, { useState } from 'react';
import './Posts.css';

const CreatePost = ({ addPost }) => {
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('General');
  const [isAgriculture, setIsAgriculture] = useState(false);
  const [crop, setCrop] = useState('');
  const [cropType, setCropType] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      user: 'Deeshan Sharma', // Mock user for now
      content,
      date: new Date().toLocaleDateString(),
      tag,
      isAgriculture,
      crop,
      cropType,
      file,
    };
    addPost(newPost);
    // Clear form after post
    setContent('');
    setTag('General');
    setIsAgriculture(false);
    setCrop('');
    setCropType('');
    setFile(null);
  };

  return (
    <div className="create-post">
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="controls">
        <label htmlFor="file">Add Media</label>
        <input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          <option value="General">General</option>
          <option value="Problem">Problem</option>
        </select>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isAgriculture}
              onChange={(e) => setIsAgriculture(e.target.checked)}
            />
            Is Agriculture
          </label>
        </div>
      </div>

      {isAgriculture && (
        <div className="agriculture-options">
          <input
            type="text"
            placeholder="Crop"
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
          />
          <input
            type="text"
            placeholder="Crop Type"
            value={cropType}
            onChange={(e) => setCropType(e.target.value)}
          />
        </div>
      )}

      <button onClick={handleSubmit}>Post</button>
    </div>
  );
};

const Post = ({ post }) => (
  <div className="post">
    <div className="post-header">
      <div className="user-info">
        <img src="/profile-picture.jpg" alt="Profile" />
        <div className="info">
          <h3>{post.user}</h3>
          <span className="date">{post.date}</span>
          <span className="tag">{post.tag}</span>
        </div>
      </div>
      <button>Edit</button>
    </div>

    <p>{post.content}</p>
    {post.file && <img src={URL.createObjectURL(post.file)} alt="Media" />}
    {post.isAgriculture && (
      <div className="agriculture-info">
        <p>Crop: {post.crop}</p>
        <p>Crop Type: {post.cropType}</p>
      </div>
    )}
    <div className="post-actions">
      <button>Like</button>
      <button>Comment</button>
      <button>Share</button>
    </div>
  </div>
);

const Posts = () => {
  const [posts, setPosts] = useState([]);

  const addPost = (post) => {
    setPosts([post, ...posts]);
  };

  return (
    <div className="container">
      <CreatePost addPost={addPost} />
      <div>
        {posts.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Posts;
