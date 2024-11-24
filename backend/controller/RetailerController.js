import { User } from "../models/user.js";

// GET endpoint to fetch all crops for sale of a specific type
export const getAllCropsForSaleByType = async (req, res) => {
  try {
    const { CropType } = req.params; // Extract cropType from request parameters
console.log("crp",req.params)
    // Fetch all users and extract the cropsForSale field along with name and location
    const users = await User.find({}, { cropsForSale: 1, name: 1, location: 1 });

    // Filter crops based on the provided cropType and include user information
    const filteredCrops = users.reduce((acc, user) => {
      if (user.cropsForSale && user.cropsForSale.length > 0) {
        const userCrops = user.cropsForSale
          .filter((crop) => crop.title === CropType) // Filter by crop type
          .map((crop) => ({
            ...crop._doc, // Include crop details
            userName: user.name, // Add user's name
            userLocation: user.location, // Add user's location
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
