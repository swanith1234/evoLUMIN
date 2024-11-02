import express from "express";
const router = express.Router();
import { promptInput } from "../controller/promptController.js";
router.post("/chat/prompt", promptInput);
export default router;
