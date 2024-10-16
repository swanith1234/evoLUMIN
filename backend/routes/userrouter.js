import express from "express";
import {
  userregister,
  userlogin,
  userlogout,
  getOneUser,
  updateUser,
  googleLogin,
} from "../controller/userController.js";
import { isAuthorizedUser } from "../middllewares/auth.js";
// import { sendEmail } from "../mail/mail.js";
const router = express.Router();

router.post("/users/register", userregister);
router.post("/users/login", userlogin);
router.get("/users/logout", isAuthorizedUser, userlogout);
// router.post("/users/register/:id", sendEmail);
router.get("/users/login/:id", getOneUser);
router.patch("/users/login/update/:id", updateUser);
router.post("/users/auth/google", googleLogin);
export default router;
