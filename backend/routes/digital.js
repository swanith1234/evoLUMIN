import express from "express";
import { digitalTool } from "../controller/digitalController.js";
// import { sendEmail } from "../mail/mail.js";
const router = express.Router();

router.get("/problem/:name/:language", digitalTool);
export default router;
