import express from "express";
import {
  addComment,
  createPost,
  getCommentsForPost,
  getPostById,
} from "../controller/postController.js";
import { isAuthorizedUser } from "../middllewares/auth.js";
import { savePost } from "../controller/postController.js";
import {
  loadUserPostsByCropType,
  likePost,
} from "../controller/postController.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
// import { sendEmail } from "../mail/mail.js";
const router = express.Router();

router.post("/post", createPost);
router.post("/post/save", savePost);
// routes/posts.js

router.get("/user/:Id/posts", async (req, res) => {
  try {
    const token = req.params.Id;
    console.log("swanitttttth", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    console.log("userId", userId);
    const user = await User.findById(userId);
    console.log("user", user);
    const posts = await loadUserPostsByCropType(userId);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error loading posts", error });
  }
});
router.get("/post/comments/:postId", getCommentsForPost);
router.post("/post/like", likePost);
router.post("/post/save", savePost);
router.post("/post/comment", addComment);
router.get("/post/:postId", getPostById);
export default router;
