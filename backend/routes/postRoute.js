import express from "express";
import { createPost } from "../controller/postController.js";
import { isAuthorizedUser } from "../middllewares/auth.js";
import { savePost } from "../controller/postController.js";
import { loadUserPostsByCropType } from "../controller/postController.js";
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

export default router;
