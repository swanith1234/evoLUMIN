import express from "express";
const router = express.Router();
import {
  getToolById,
  getToolsByUserCrop,
} from "../controller/toolController.js";
console.log("toolsroute");
router.get("/tools/:id", getToolsByUserCrop);
router.get("/tools/:cropName/:productionStageName/:title", getToolById);
export default router;
