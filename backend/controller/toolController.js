import mongoose from "mongoose";
import { Tools } from "../models/tools.js"; // Assuming this is your model file
import { User } from "../models/user.js"; // Assuming the User model is in a separate file
import jwt from "jsonwebtoken";
// Function to get tools based on the user's crop
export const getToolsByUserCrop = async (req, res, next) => {
  try {
    const token = req.params.id;
    console.log("token at tools", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    // Fetch the user's crop from the User model
    const user = await User.findById(userId);

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const { crop } = user; // Extract the crop from the user's details
    console.log(crop);

    // Fetch the agriculture document associated with the user's crop
    const agriculture = await Tools.findOne(
      { "crops.cropName": crop }, // Filter to find the crop
      { "crops.$": 1 } // Limit to just the matching crop
    );

    // If no agriculture found for the crop
    if (!agriculture || agriculture.crops.length === 0) {
      res.status(404).json({
        success: false,
        message: "No tools found for the specified crop",
      });
    }

    // Extract the production stages from the found crop
    const cropDetails = agriculture.crops[0]; // Since we used crops.$, it should return only one crop
    const tools = cropDetails.productionStages.flatMap((stage) => stage.tools); // Extract all tools from each production stage

    // Return the tools
    res.status(200).json({
      success: true,
      cropDetails,
    });
  } catch (error) {
    console.error("Error fetching tools by crop:", error);
    return { success: false, message: "Error fetching tools", error };
  }
};

// Function to get a specific tool by its ID
export const getToolById = async (req, res, next) => {
  try {
    const { cropName, productionStageName, title } = req.params; // Extract parameters from request
    console.log("Crop Name:", cropName);
    console.log("Production Stage Name:", productionStageName);
    console.log("Tool ID:", title);

    // Find the agriculture document that contains the specified crop
    const agriculture = await Tools.findOne(
      { "crops.cropName": cropName }, // Filter to find the specified crop
      { "crops.$": 1 } // Limit to just the matching crop
    );

    // If no document found
    if (!agriculture) {
      return res.status(404).json({
        success: false,
        message: "Agriculture document not found",
      });
    }

    // Extract the crop from the found agriculture document
    const crop = agriculture.crops[0];

    // Find the specified production stage by name
    const productionStage = crop.productionStages.find(
      (stage) => stage.stageName === productionStageName
    );

    // If the production stage is not found
    if (!productionStage) {
      return res.status(404).json({
        success: false,
        message: "Production stage not found",
      });
    }

    // Find the tool in the specified production stage
    // Find the tool in the specified production stage
    const foundTool = productionStage.tools.find(
      (tool) => tool.title === title
    );

    // If the tool is not found
    if (!foundTool) {
      console.log("Available tools:", productionStage.tools); // Log available tools
      console.log("Tool ID being searched:", title); // Log the title being searched
      return res.status(404).json({
        success: false,
        message: "Tool not found",
      });
    }

    // Return the found tool details
    return res.status(200).json({
      success: true,
      tool: foundTool,
    });
  } catch (error) {
    console.error("Error fetching tool by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching tool",
      error,
    });
  }
};
