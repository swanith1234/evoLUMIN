import router from "./digital.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
router.post("/postCrop/:id", async (req, res) => {
  try {
    const { id } = req.params; // Use the ID from the route parameters
    const { crop, quantity, images } = req.body; // Extract crop data from the request body

    // Find the user by ID to update
    const decoded = jwt.verify(id, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Update the user's crop details
    user.crop = crop;
    user.cropQuantityForSale = quantity;
    user.cropImage = images;
    console.log("cropDetails");
    // Save the updated user document
    const updatedUser = await user.save();
    return res.status(200).json({ success: true, cropDetails: updatedUser });
  } catch (error) {
    // Log the error for debugging
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// Define the GET endpoint to fetch crop details
router.get("/getCropDetails/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the route parameters

    // Decode the token to get the user ID
    const decoded = jwt.verify(id, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Extract crop details from the user document
    const cropDetails = {
      crop: user.crop,
      cropQuantityForSale: user.cropQuantityForSale,
      cropImage: user.cropImage,
    };
    console.log(cropDetails);
    return res.status(200).json({ success: true, cropDetails });
  } catch (error) {
    // Log the error for debugging
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
