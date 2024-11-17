// CommentTypeModal.js
import React from "react";
import "./CommentTypeModal.css"; // Add relevant CSS styles for the modal

const CommentTypeModal = ({ onClose, onSelectType }) => {
  return (
    <div className="comment-type-modal">
      <div className="modal-content">
        <h3>Select Comment Type</h3>
        <button
          onClick={() => {
            console.log("Normal Comment");
            onSelectType(false);
          }}
        >
          Normal Comment
        </button>
        <button onClick={() => onSelectType(true)}>Solution</button>
        <button onClick={onClose} className="close-modal">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CommentTypeModal;
