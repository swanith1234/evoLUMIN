import React from "react";
import "./CommentButton.css";

const CommentButton = ({ commentCount, toggleComment, id }) => {
  const uniqueId = `comment-${id}`; // Generate unique id dynamically

  return (
    <div className="comment-button" onClick={toggleComment}>
      <label className="comment" htmlFor={uniqueId}>
        <div className="flex space-x-2 icon-text">
          <i class="fa-regular fa-comment comment-icon"></i>
          <span className="comment-count">{commentCount}</span>
        </div>
        <span className="comment-text">Comments</span>
      </label>
    </div>
  );
};

export default CommentButton;
