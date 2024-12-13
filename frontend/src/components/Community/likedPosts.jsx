import { useState, useContext, useEffect } from "react";
import Avatar from "../Avatar";
import { AuthContext } from "../authContext";
import "./Posts.css";
import axios from "axios";
import Loader from "../Loader";
import CommentTypeModal from "./commentModal";
const LikedPost = ({
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
}) => {
  console.log("postId: " + postId);
  const { userInfo } = useContext(AuthContext);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [postComments, setPostComments] = useState({});
  const [userLikedPosts, setUserLikedPosts] = useState();
  const [currentLikes, setCurrentLikes] = useState(numberOfLikes || 0);
  const [showCommentTypeModal, setShowCommentTypeModal] = useState(false);
  console.log(likes, comments);
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
    console.log("sol", isSolution);
    setShowCommentTypeModal(false);
    try {
      console.log("result");
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
            isSolution: isSolution, // Pass the selected comment type
          }),
        }
      );
      console.log("res");
      const result = await response.json();
      console.log("result", result);
      if (result.success) {
        setNewComment(""); // Clear the input field
        fetchComments(); // Fetch updated comments
      } else {
        console.error("Failed to add comment:", result.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error.message);
    } finally {
      setShowCommentTypeModal(false); // Close the modal after submission
    }
  };

  const [isLiked, setIsLiked] = useState(
    likes.some((like) => like._id === userInfo.user._id)
  );
  console.log("isLiked", isLiked);
  console.log("likeId", likes[0]);
  console.log("userId", userInfo.user._id);

  // Check if the current user has liked the post
  useEffect(() => {
    console.log("likes", likes);

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
      console.log("res", res);

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
      console.log("res", res);
    } catch (err) {
      console.log("Error saving post", err);
    }
  };

  return (
    <div className="post">
      <div className="post-author">
        <div className="avtar">
          <Avatar width={50} height={50} name={userInfo.user.name} />
        </div>
        <div className="user-info">
          <div className="name">{userInfo.user.name}</div>
          <div className="role">
            <span
              style={{
                color:
                  userInfo.user.role === "farmer"
                    ? "lightgreen"
                    : userInfo.user.role === "agro-expert"
                    ? "lightyellow"
                    : userInfo.user.role === "student"
                    ? "lightbrown"
                    : "transparent",
              }}
            >
              {userInfo.user.role}
            </span>
          </div>
          <div className="time">{timeAgo(createdAt)}</div>
        </div>
      </div>
      <p>{description}</p>
      {media && (
        <div className="post-media">
          <img src={media} alt="Post media" />
        </div>
      )}

      <div className="post-interactions">
        <button
          className={`post-like-button post-button ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
        >
          <i
            className={`${
              isLiked
                ? "fa-solid fa-thumbs-up liked-icon"
                : "fa-regular fa-thumbs-up "
            }`}
          ></i>
          <div className="text"> Like ({currentLikes})</div>
        </button>

        <button
          className="post-comment-button post-button"
          onClick={toggleComments}
        >
          <i className="fa-regular fa-comment"></i>
          <div className="text"> Comments ({comments.length})</div>
        </button>
        <button className="post-save-button post-button" onClick={handleSave}>
          <i className="fa-regular fa-bookmark"></i>
          <div className="text"> Save </div>
        </button>
      </div>

      {commentsVisible && (
        <div className="comments-section">
          <div className="add-comment">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={handleAddComment} className="send-comment">
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          {postComments.map((comment, index) => (
            <div className="comment" key={index}>
              <div className="comment-author">
                <div className="comment-user-info">
                  <Avatar width={30} height={30} name={comment.user.name} />
                  <div className="comment-name">{comment.user.name}</div>
                  <div
                    className="comment-user-role "
                    style={{ fontWeight: "400" }}
                  >
                    {" "}
                    ({" "}
                    <span
                      style={{
                        color:
                          userInfo.user.role === "farmer"
                            ? "lightgreen"
                            : userInfo.user.role === "agro-expert"
                            ? "lightyellow"
                            : userInfo.user.role === "student"
                            ? "lightbrown"
                            : "transparent",
                      }}
                    >
                      {userInfo.user.role}
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
                <div className="comment-time">{timeAgo(comment.createdAt)}</div>
              </div>
              <div className="comment-body">{comment.text}</div>
            </div>
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
const LikedPosts = () => {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { token, userInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/${token}/posts`
        );

        // Filter posts to show only those liked by the user
        const likedPosts = response.data.filter(
          (post) => post.likes && post.likes.includes(userInfo.user._id)
        );
        console.log("liking posts", likedPosts);
        setPosts(likedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [token, userInfo]);

  const addPost = (post) => {
    // If the new post is liked by the user, add it to the list
    if (post.likes && post.likes.includes(userInfo.userId)) {
      setPosts([post, ...posts]);
    }
  };

  return (
    <div className="posts-page-container">
      {loading && <Loader show={loading} />}
      <div className="posts-container" style={{ position: "relative" }}>
        {posts.map((post, index) => (
          <LikedPost
            key={post._id || index}
            postId={post._id}
            description={post.description}
            media={post.media}
            crop={post.crop}
            cropType={post.cropType}
            createdAt={post.createdAt}
            numberOfLikes={post.numberOfLikes}
            numberOfComments={post.numberOfComments}
            author={post.userId}
            likes={post.likes || []}
            comments={post.comments || []}
          />
        ))}
      </div>
    </div>
  );
};

export default LikedPosts;
