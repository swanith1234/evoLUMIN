import { User } from "../models/user.js";
import dotenv from "dotenv";
dotenv.config({ path: "../env" });
import ErrorHandler from "../middllewares/error.js";
import twilio from "twilio";
// GET endpoint to fetch all crops for sale of a specific type
export const getAllCropsForSaleByType = async (req, res) => {
  try {
    const { CropType } = req.params; // Extract cropType from request parameters
console.log("crp",req.params)
    // Fetch all users and extract the cropsForSale field along with name and location
    const users = await User.find({}, { cropsForSale: 1, name: 1, district: 1 });

    // Filter crops based on the provided cropType and include user information
    const filteredCrops = users.reduce((acc, user) => {
      if (user.cropsForSale && user.cropsForSale.length > 0) {
        const userCrops = user.cropsForSale
          .filter((crop) => crop.title === CropType) // Filter by crop type
          .map((crop) => ({
            ...crop._doc, // Include crop details
            userName: user.name, 
            userId:user.id,// Add user's name
            userLocation: user.district, // Add user's location
          }));
        return acc.concat(userCrops);
      }
      return acc;
    }, []);

    // If no crops match the given type, return a 404 response
    if (filteredCrops.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No crops found for the type: ${CropType}`,
      });
    }

    // Return the filtered crops
    return res.status(200).json({
      success: true,
      crops: filteredCrops,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching crops for sale:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};


const accountSid = process.env.TWILIO_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio Auth Token
const client = new twilio(accountSid, authToken);

export const addMediatorToCrop = async (req, res) => {
  try {
    const { cropTitle, userId, id } = req.body;
    console.log(cropTitle, userId, id);

    // Find the user document with the given userId and the specific crop title
    const user = await User.findOne({
      _id: userId,
      "cropsForSale.title": cropTitle,
    });

    if (!user) {
      return res.status(404).json({ message: "User or crop not found" });
    }

    // Update the mediators array for the specific crop
    const crop = user.cropsForSale.find((crop) => crop.title === cropTitle);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    // Check if the id is already in the mediators array
    if (crop.mediators.includes(id)) {
      return res.status(400).json({ message: "Mediator already added" });
    }

    // Add the mediator ID to the mediators array
    crop.mediators.push(id);

    // Save the updated user document
    await user.save();

    console.log(user.phone);

    // Send a message to the user using Twilio
    if (user.phone) {
      await client.messages.create({
        body: `A new mediator has been added to your crop: ${cropTitle}`,
        from: "+18647148091", // Replace with your Twilio phone number
        to: `+91 ${user.phone}`, // Ensure phone number is in correct format
      });
    }

    console.log("message sent");
    return res.status(200).json({
      message: "Mediator added and user notified",
      crop,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


