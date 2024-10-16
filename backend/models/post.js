import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model for the commenter
    required: true,
  },
  tag: {
    type: String,
    enum: ["normal", "solution"], // Specify whether the comment is a normal comment or a solution
    required: true,
  },
  message: {
    type: String,
    required: [true, "Comment message is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  media: {
    type: String, // You can change this to the appropriate type for media (e.g., URL)
  },
  tag: {
    type: String,
    enum: ["problem", "normal"],
    required: true,
  },
  isAgriculture: {
    type: Boolean,
    required: true,
  },
  crop: {
    type: String,
    default: null,
  },
  cropType: {
    type: String,
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Array of user IDs who liked the post
    },
  ],
  comments: [commentSchema], // Embedding the commentSchema to store comments on the post
  numberOfLikes: {
    type: Number,
    default: 0,
  },
  numberOfComments: {
    type: Number,
    default: 0,
  },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
