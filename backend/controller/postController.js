import { run } from "../geminiAiApi.js"; // Import the run function from your gemini service
import Post from "../models/post.js"; // Import your Post model
import mongoose from "mongoose";
// Controller function to handle the creation of a post
export const createPost = async (req, res) => {
  try {
    const { description, media, tag, userId } = req.body;
    console.log(userId);
    // Step 1: Validate the incoming request data
    if (!description || !tag) {
      return res
        .status(400)
        .json({ message: "Description and tag are required!" });
    }

    // // Step 2: Analyze the post using Gemini API (run function)
    // const geminiResponse = await run(description);

    // if (!geminiResponse) {
    //   return res
    //     .status(500)
    //     .json({ message: "Failed to analyze the post with Gemini API." });
    // }

    // // Step 3: Extract data from the Gemini API response
    // const { isAgriculture, crop, cropType } = geminiResponse;
    const isAgriculture = true;
    const crop = "paddy";
    const cropType = "local";

    // Step 4: Prepare the post object for saving
    const newPost = new Post({
      description,
      media,
      tag,
      isAgriculture,
      crop: isAgriculture ? crop : null,
      cropType: isAgriculture ? cropType : null,
      userId,
      createdAt: Date.now(),
    });

    // Step 5: Save the post to the database
    await newPost.save();

    // Step 6: Return a success response
    return res.status(201).json({
      message: "Post created successfully!",
      post: newPost,
    });
  } catch (error) {
    // Error handling
    console.error("Error creating post:", error);
    return res.status(500).json({
      message: "An error occurred while creating the post.",
      error: error.message,
    });
  }
};
