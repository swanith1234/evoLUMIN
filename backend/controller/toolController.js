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
    console.log("crop",crop);

    // Fetch the agriculture document associated with the user's crop
    const agriculture = await Tools.findOne(
      { "crops.cropName": crop }, // Filter to find the crop
      { "crops.$": 1 } // Limit to just the matching crop
    );
console.log("agriculture", agriculture);
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
// Function to book a tool for a user and add it to their bookedTools array
// Function to book a tool for a user and add it to their bookedTools array
export const bookToolForUser = async (req, res, next) => {
  try {
    const { cropName, productionStageName, title } = req.body;
    const token = req.params.id;
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const toolResult = await getToolByParameters(
      cropName,
      productionStageName,
      title
    );
    if (!toolResult.success) {
      return res
        .status(404)
        .json({ success: false, message: toolResult.message });
    }

    const tool = toolResult.tool;
    console.log("Retrieved tool:", tool.title);

    if (!tool || !tool.title) {
      return res
        .status(400)
        .json({ success: false, message: "Tool title is missing" });
    }

    const serviceTime = new Date();
    serviceTime.setHours(serviceTime.getHours() + 24);

    const newBooking = {
      toolTitle: tool.title,
      serviceTime,
    };

    if (!user.bookedToolTitles.includes(tool.title)) {
      user.bookedToolTitles.push(tool.title);
    }

    user.bookedTools.push(newBooking);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Tool booked successfully for 24 hours from now",
      bookedTool: newBooking,
    });
  } catch (error) {
    console.error("Error booking tool for user:", error);
    res.status(500).json({
      success: false,
      message: "Error booking tool",
      error,
    });
  }
};

// Function to get a specific tool by its ID or other parameters
export const getToolByParameters = async (
  cropName,
  productionStageName,
  title
) => {
  try {
    // Find the agriculture document that contains the specified crop
    const agriculture = await Tools.findOne(
      { "crops.cropName": cropName },
      { "crops.$": 1 }
    );

    if (!agriculture) {
      return { success: false, message: "Agriculture document not found" };
    }

    // Extract the crop from the found agriculture document
    const crop = agriculture.crops[0];

    // Find the specified production stage by name
    const productionStage = crop.productionStages.find(
      (stage) => stage.stageName === productionStageName
    );

    if (!productionStage) {
      return { success: false, message: "Production stage not found" };
    }

    // Find the tool in the specified production stage by title
    const foundTool = productionStage.tools.find(
      (tool) => tool.title === title
    );

    if (!foundTool) {
      return { success: false, message: "Tool not found" };
    }

    // Return the found tool details
    return { success: true, tool: foundTool };
  } catch (error) {
    console.error("Error fetching tool by ID:", error);
    return { success: false, message: "Error fetching tool", error };
  }
};
export const getNearbyServiceBookings = async (req, res, next) => {
  try {
    // Extract the token and toolId from the request
    const token = req.query.token || req.params.id;
    const { toolTitle } = req.query;

    // Validate token and toolId presence
    if (!token || !toolTitle) {
      return res.status(400).json({
        success: false,
        message: "Token or toolId is missing in the request",
      });
    }
    console.log("tooling", toolTitle);
    // Verify and decode the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    const userId = decoded.id;

    // Fetch user with coordinates
    const user = await User.findById(userId).select("coordinates");
    if (
      !user ||
      !user.coordinates ||
      !Array.isArray(user.coordinates.coordinates) ||
      user.coordinates.coordinates.length !== 2
    ) {
      return res.status(404).json({
        success: false,
        message: "User location is missing or invalid",
      });
    }

    const userCoordinates = user.coordinates.coordinates;

    // Radius in radians for 10 km (10 km / Earth's radius in kilometers)
    const radius = 10 / 6378.1;

    // Find nearby users who booked the specified tool within the 10 km radius
    const usersNearby = await User.find({
      coordinates: {
        $geoWithin: { $centerSphere: [userCoordinates, radius] },
      },
    });

    const usersWithBookedTool = await User.find({
      bookedToolTitles: toolTitle,
    });

    console.log("Nearby Users Count:", usersNearby.length);
    console.log(
      "Nearby User IDs:",
      usersNearby.map((user) => user._id)
    );

    console.log("Users with Booked Tool Count:", usersWithBookedTool.length);
    console.log(
      "User IDs with Booked Tool:",
      usersWithBookedTool.map((user) => user._id)
    );

    // Then check the intersection
    const nearbyUsersCount = await User.find({
      coordinates: { $geoWithin: { $centerSphere: [userCoordinates, radius] } },
      bookedToolTitles: toolTitle,
    }).countDocuments();

    console.log("nearbyUsersCount", nearbyUsersCount);
    res.status(200).json({
      success: true,
      message: `Number of users who booked tool with ID ${toolTitle} within 10 km`,
      count: nearbyUsersCount,
    });
  } catch (error) {
    console.error("Error fetching nearby service bookings:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching nearby service bookings",
      error: error.message,
    });
  }
};
