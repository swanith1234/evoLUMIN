import React, { useState, useEffect, useContext } from "react";
import "./Posts.css?v=1.0.1";
import PostModal from "./PostModal";
import { AuthContext } from "../authContext";
import axios from "axios";

// Define the Post component to display detailed information about each post
const Post = ({
  description,
  media,
  crop,
  cropType,
  createdAt,
  numberOfLikes,
  numberOfComments,
  author,
  likes,
  comments,
}) => {
  return (
    <div className="post">
      <h3>{cropType ? `Crop Type: ${cropType}` : "General Post"}</h3>
      <p>{description}</p>
      {media && (
        <div className="post-media">
          <img src={media} alt="Post media" />
        </div>
      )}
      <p>
        <strong>Crop:</strong> {crop || "N/A"}
      </p>
      <p>
        <em>By {author?.name || "Unknown"}</em> |{" "}
        <em>{new Date(createdAt).toLocaleDateString()}</em>
      </p>
      <p>
        <strong>Likes:</strong> {numberOfLikes}
      </p>
      <p>
        <strong>Comments:</strong> {numberOfComments}
      </p>
      <div className="post-interactions">
        <button className="post-like-button">Like ({likes.length})</button>
        <button className="post-comment-button">
          Comments ({comments.length})
        </button>
      </div>
    </div>
  );
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { token, userInfo } = useContext(AuthContext);

  // Fetch posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/${token}/posts`
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [token]);

  const addPost = (post) => {
    setPosts([post, ...posts]);
  };

  return (
    <div className="posts-page-container">
      <div className="posts-container" style={{ position: "relative" }}>
        {posts.map((post, index) => (
          <Post
            key={post._id || index}
            description={post.description}
            media={post.media}
            crop={post.crop}
            cropType={post.cropType}
            createdAt={post.createdAt}
            numberOfLikes={post.numberOfLikes}
            numberOfComments={post.numberOfComments}
            author={post.userId} // assuming userId contains author details
            likes={post.likes || []}
            comments={post.comments || []}
          />
        ))}

        <div className="sticky-bar">
          <input
            placeholder="Create a post..."
            className="sticky-input"
            onClick={() => setShowModal(true)}
          />
        </div>

        <PostModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onCreatePost={addPost}
        />
      </div>

      <div className="Profile-Right">
        <p className="post-tagline">
          Growing Together: Your Agricultural Community Hub
        </p>
        <div className="post-media-container">
          {/* Image will be added as a background in CSS */}
        </div>
      </div>
    </div>
  );
};

export default Posts;
