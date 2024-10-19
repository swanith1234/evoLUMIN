import mongoose from 'mongoose';
import {Tools} from '../models/tools.js'; // Assuming this is your model file
import {User} from '../models/user.js';   // Assuming the User model is in a separate file

// Function to get tools based on the user's crop
export const getToolsByUserCrop = async (userId) => {
  try {
    // Fetch the user's crop from the User model
    const user = await User.findById(userId);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const { crop } = user; // Extract the crop from the user's details

    // Fetch the tools related to the user's crop from the Tools model
    const tools = await Tools.find({
      "crops.cropName": crop // Filter tools based on the user's crop
    }, {
      "crops.$": 1 // Limit the return to just the matching crop and its production stages
    });

    if (!tools || tools.length === 0) {
      return { success: false, message: 'No tools found for this crop' };
    }

    return { success: true, tools };

  } catch (error) {
    console.error("Error fetching tools by crop:", error);
    return { success: false, message: 'Error fetching tools', error };
  }
};

