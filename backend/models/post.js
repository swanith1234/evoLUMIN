import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", // Reference to the Post schema
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User schema
    required: true,
  },
  isSolution: {
    type: Boolean,
    default: false, // Indicates if this comment is a solution or a normal comment
  },
  message: {
    type: String,
    required: true, // The content of the comment
    trim: true,
  },
  commentMedia: [
    {
      type: String, // Each item in the array is a URL string for an image or video
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets the comment time to the current date
  },
});
commentSchema.virtual("timeAgo").get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day(s) ago`;
  if (hours > 0) return `${hours} hour(s) ago`;
  if (minutes > 0) return `${minutes} minute(s) ago`;
  return `just now`;
});

const postSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  media: [
    {
      type: String, // Each item in the array is a URL string for an image or video
    },
  ],
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
    required: true,
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
