import mongoose from "mongoose";

// Define the schema for storing app/website data
const appRecommendationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructions: {
    type: [String], // Array of step-by-step instructions
    required: true,
  },
  rating: {
    type: String, // Can be a number or 'N/A' if not available
    default: "N/A",
  },
  comments: {
    type: [String], // Array to store user comments or feedback
    default: [],
  },
  screenshots: {
    type: [String], // Array of URLs for screenshots
    default: [],
  },
  videos: {
    type: [String], // Array of URLs for videos
    default: [],
  },
  link: {
    type: String, // URL to the app/website
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model based on the schema
const AppRecommendation = mongoose.model(
  "AppRecommendation",
  appRecommendationSchema
);

export default AppRecommendation;
