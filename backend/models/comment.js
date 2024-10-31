import mongoose from "mongoose";

// Virtual field to calculate how long ago the comment was made

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
