import express from "express";
import { createPost } from "../controller/postController.js";
import { isAuthorizedUser } from "../middllewares/auth.js";
// import { sendEmail } from "../mail/mail.js";
const router = express.Router();

router.post("/post", createPost);
export default router;
