import express from "express";
const router = express.Router();
import {
  bookToolForUser,
  getNearbyServiceBookings,
  getToolById,
  getToolsByUserCrop,
} from "../controller/toolController.js";
console.log("toolsroute");
router.get("/tools/:id", getToolsByUserCrop);
router.get("/tools/:cropName/:productionStageName/:title", getToolById);
router.post("/tools/book/:id", bookToolForUser);
router.get("/tools/nearby/:id", getNearbyServiceBookings);
export default router;
