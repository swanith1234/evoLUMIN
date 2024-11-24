import React, { useState, useContext, useEffect } from "react";
import Avatar from "../Avatar";
import { AuthContext } from "../authContext";
import "./Posts.css";
import axios from "axios";
import PostModal from "./PostModal";
import { uploadFile } from "../../upload";
import CommentTypeModal from "./commentModal";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import Loader from "../Loader";
const Post = ({
  postId,
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
  authorRole,
  tag,
}) => {
  const { userInfo } = useContext(AuthContext);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [postComments, setPostComments] = useState({});
  const [userLikedPosts, setUserLikedPosts] = useState();
  const [currentLikes, setCurrentLikes] = useState(numberOfLikes || 0);
  const [showCommentTypeModal, setShowCommentTypeModal] = useState(false);
  const [commentMedia, setCommentMedia] = useState("");
  console.log("author: ", author);
  function timeAgo(dateString) {
    const postDate = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - postDate) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    if (diffInSeconds < intervals.minute) return "now";
    else if (diffInSeconds < intervals.hour)
      return `${Math.floor(diffInSeconds / intervals.minute)} min ago`;
    else if (diffInSeconds < intervals.day)
      return `${Math.floor(diffInSeconds / intervals.hour)} hr${
        Math.floor(diffInSeconds / intervals.hour) > 1 ? "s" : ""
      } ago`;
    else if (diffInSeconds < intervals.week)
      return `${Math.floor(diffInSeconds / intervals.day)} day${
        Math.floor(diffInSeconds / intervals.day) > 1 ? "s" : ""
      } ago`;
    else if (diffInSeconds < intervals.month)
      return `${Math.floor(diffInSeconds / intervals.week)} week${
        Math.floor(diffInSeconds / intervals.week) > 1 ? "s" : ""
      } ago`;
    else if (diffInSeconds < intervals.year)
      return `${Math.floor(diffInSeconds / intervals.month)} month${
        Math.floor(diffInSeconds / intervals.month) > 1 ? "s" : ""
      } ago`;
    return `${Math.floor(diffInSeconds / intervals.year)} year${
      Math.floor(diffInSeconds / intervals.year) > 1 ? "s" : ""
    } ago`;
  }

  // Function to fetch comments from the server
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/post/comments/${postId}`
      );

      setPostComments(res.data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // Fetch comments when the component mounts or when comments are toggled
  useEffect(() => {
    fetchComments();
  }, []);

  const toggleComments = () => {
    setCommentsVisible(!commentsVisible);
  };
  const handleAddComment = () => {
    // Show the modal to select comment type before submitting
    if (newComment.trim()) {
      setShowCommentTypeModal(true);
    }
  };

  // Handle comment submission with selected type
  const submitComment = async (isSolution) => {
    setShowCommentTypeModal(false);
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/post/comment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userInfo.user._id,
            postId: postId,
            message: newComment,
            isSolution: isSolution,
            commentMedia: commentMedia,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        // Create a new comment object
        const newCommentObj = {
          user: userInfo.user,
          text: newComment,
          createdAt: new Date().toISOString(),
          isSolution: isSolution,
          commentMedia: commentMedia,
        };

        // Update the postComments state with the new comment
        setPostComments((prevComments) => [newCommentObj, ...prevComments]);
        setNewComment(""); // Clear the input field
      } else {
        console.error("Failed to add comment:", result.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error.message);
    } finally {
      setShowCommentTypeModal(false); // Close the modal after submission
    }
  };

  const handleMediaChange = async (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    const uploadedMedia = await Promise.all(
      files.map(async (file) => {
        const uploadedFile = await uploadFile(file);
        console.log("upload", uploadedFile);
        return uploadedFile.url; // Extract the URL for each uploaded file
      })
    );

    setCommentMedia((prevMedia) => [...prevMedia, ...uploadedMedia]); // Append new uploads to the existing media array
  };
  const [isLiked, setIsLiked] = useState(
    likes.some((like) => like._id === userInfo.user._id)
  );

  // Check if the current user has liked the post
  useEffect(() => {
    // Check if the user ID exists in the likes array
    const userHasLiked = likes.some((like) => like === userInfo.user._id);

    if (userHasLiked) {
      setIsLiked(true); // Set the post as liked if the user has liked it
    }
  }, [likes, userInfo.user._id]); // Depend on `likes` and `userInfo.user._id`

  const handleLike = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/v1/post/like", {
        postId: postId,
        userId: userInfo.user._id,
      });

      // Update the state and reflect changes in UI
      if (res.data.message.includes("unliked")) {
        setIsLiked(false); // Remove the like if already liked
        likes = likes.filter((like) => like._id !== userInfo.user._id); // Remove like from array
        setCurrentLikes(currentLikes - 1);
      } else {
        setIsLiked(true); // Add like if not already liked
        likes.push({ _id: userInfo.user._id });
        setCurrentLikes(currentLikes + 1); // Add user to likes array
      }
      // Update the likes count in the UI
      numberOfLikes = likes.length;
    } catch (err) {
      console.log("Error liking post", err);
    }
  };
  const handleSave = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/v1/post/save", {
        postId: postId,
        userId: userInfo.user._id,
      });
    } catch (err) {
      console.log("Error saving post", err);
    }
  };

  return (
    <div
      className="post"
      style={{
        border: `5px solid ${tag === "normal" ? "#B0EBB4" : "#FA7070"}`,
      }}
    >
      <div
        className="post-author"
        style={{
          backgroundColor: tag === "normal" ? "#B0EBB4" : "#FA7070",
        }}
      >
        <div className="avtar">
          <Avatar width={50} height={50} name={author} />
        </div>
        <div className="user-info">
          <div className="name">{author}</div>
          <div className="role">
            <span
              style={{
                color:
                  authorRole === "farmer"
                    ? "lightgreen"
                    : authorRole === "agro-expert"
                    ? "lightyellow"
                    : authorRole === "student"
                    ? "lightbrown"
                    : "transparent",
              }}
            >
              {authorRole}
            </span>
          </div>
          <div className="time">{timeAgo(createdAt)}</div>
        </div>
      </div>
      <p>{description}</p>
      {media && media.length > 0 && (
        <div className="post-media">
          {media.map((url, index) =>
            url.endsWith(".mp4") || url.endsWith(".webm") ? (
              <video key={index} controls className="media-item">
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                key={index}
                src={url}
                alt={`Post media ${index + 1}`}
                className="media-item"
              />
            )
          )}
        </div>
      )}

      <div className="post-interactions">
        <LikeButton
          isLiked={isLiked}
          likeCount={currentLikes}
          onLike={handleLike}
          id={postId}
        />
        <button
          className="post-comment-button post-button"
          onClick={toggleComments}
        >
          {/* <i className="fa-regular fa-comment"></i>
          <div className="text"> Comments ({comments.length})</div> */}
          <CommentButton
            commentCount={comments.length}
            toggleComment={toggleComments}
            id={postId}
          ></CommentButton>
        </button>
        <button className="post-save-button post-button" onClick={handleSave}>
          <i className="fa-regular fa-bookmark"></i>
          <div className="text"> Save </div>
        </button>
      </div>

      {/* Comments Section */}
      {commentsVisible && (
        <div className="comments-section">
          <div className="add-comment">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            {/* Media upload for comments */}
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaChange}
              id="comment-media-upload"
              style={{ display: "none" }}
            />
            <div className="flex comment-options">
              <label htmlFor="comment-media-upload" id="label">
                <i class="fa-solid fa-plus"></i>
              </label>

              {/* Show Submit button only when there is a comment */}
              <button
                onClick={handleAddComment}
                className="send-comment"
                id="send-button"
                disabled={!newComment.trim()}
              >
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
          {postComments.map((comment, index) => (
            <>
              <div className="comment" key={index}>
                <div className="comment-author">
                  <div className="comment-user-info">
                    <Avatar width={30} height={30} name={comment.user.name} />
                    <div className="comment-name">{comment.user.name}</div>
                    <div
                      className="comment-user-role"
                      style={{ fontWeight: "400" }}
                    >
                      {" "}
                      ({" "}
                      <span
                        style={{
                          color:
                            authorRole === "farmer"
                              ? "lightgreen"
                              : authorRole === "agro-expert"
                              ? "lightyellow"
                              : authorRole === "student"
                              ? "lightbrown"
                              : "transparent",
                        }}
                      >
                        {authorRole}
                      </span>
                      )
                    </div>
                    <div className="solution-icon">
                      {comment.isSolution ? (
                        <i className="fa-regular fa-circle-check"></i>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="comment-time">
                    {timeAgo(comment.createdAt)}
                  </div>
                </div>
                <div className="comment-body">{comment.text}</div>

                {/* Check if commentMedia exists */}
                {comment.commentMedia && (
                  <div className="comment-media">
                    {comment.commentMedia.map((media, mediaIndex) => (
                      <div key={mediaIndex} className="media-item">
                        {console.log("media", media)}
                        {media.includes("jpg") ? (
                          <img
                            src={media}
                            alt={`comment-media-${mediaIndex}`}
                            className="media-image"
                          />
                        ) : media.type === "video" ? (
                          <video
                            src={media.url}
                            controls
                            className="media-video"
                          />
                        ) : (
                          <div>Unsupported media type</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ))}
        </div>
      )}
      {showCommentTypeModal && (
        <CommentTypeModal
          onClose={() => setShowCommentTypeModal(false)}
          onSelectType={submitComment}
        />
      )}
    </div>
  );
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false); // State to manage loading indicator.

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Start loader
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/${token}/posts`
        );
        console.log("res", response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // Stop loader
      }
    };

    fetchPosts();
  }, [token]);

  const addPost = (post) => {
    setPosts([post, ...posts]);
  };

  return (
    <div className="posts-page-container">
      {/* Display Loader while loading */}
      {loading && <Loader show={loading} />}

      {/* Main Content */}
      {!loading && (
        <div className="posts-container" style={{ position: "relative" }}>
          {posts.map((post, index) => (
            <Post
              key={post._id || index} // Added key to prevent React warnings
              postId={post._id || index}
              description={post.description}
              media={post.media}
              crop={post.crop}
              cropType={post.cropType}
              createdAt={post.createdAt}
              numberOfLikes={post.numberOfLikes}
              numberOfComments={post.numberOfComments}
              author={post.userId.name}
              likes={post.likes || []}
              comments={post.comments || []}
              tag={post.tag || ""}
              authorRole={post.userId.role}
            />
          ))}

          {/* Post Modal */}
          <PostModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onCreatePost={addPost}
          />
        </div>
      )}

      {/* Sticky Bar */}
      <div className="sticky-bar">
        <input
          placeholder="Create a post..."
          className="sticky-input"
          onClick={() => setShowModal(true)}
        />
      </div>
    </div>
  );
};

export default Posts;
