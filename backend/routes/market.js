import router from "./digital.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { addMediatorToCrop, getAllCropsForSaleByType } from "../controller/RetailerController.js";

// POST endpoint to add crop details to the `cropsForSale` array
router.post("/postCrop/:id", async (req, res) => {
  try {
    const { id } = req.params; // Use the ID from the route parameters
    const { title, description, quantity, images, video } = req.body; // Extract crop data from the request body

    // Decode the token to get the user ID
    const decoded = jwt.verify(id, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    // Find the user by ID to update
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Add new crop details to the `cropsForSale` array
    const newCrop = {
      title,
      description,
      quantity,
      images,
      video,
    };
    console.log("new", newCrop);
    user.cropsForSale.push(newCrop);

    // Save the updated user document
    const updatedUser = await user.save();
    return res.status(200).json({
      success: true,
      message: "Crop added successfully",
      cropsForSale: updatedUser.cropsForSale,
    });
  } catch (error) {
    // Log the error for debugging
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/getCropDetails/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const decoded = jwt.verify(id, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Fetch the crop details from the `cropsForSale` array
    const cropDetails = user.cropsForSale;

    // Extract mediator phone numbers for each crop
    const mediatorPhoneNumbers = cropDetails.map((crop) => crop.mediators).flat();

    return res.status(200).json({
      success: true,
      cropsForSale: cropDetails,

    });
  } catch (error) {
    // Log the error for debugging
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});



router.get("/getCropDetailsByType/:CropType", getAllCropsForSaleByType);
router.post('/notifyFarmer',addMediatorToCrop)
export default router;
