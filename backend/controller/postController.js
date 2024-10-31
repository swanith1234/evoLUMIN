import { run } from "../geminiAiApi.js"; // Import the run function from your gemini service
import Post from "../models/post.js"; // Import your Post model
import mongoose from "mongoose";
import { User } from "../models/user.js";
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
    const prompt = ` Please classify the following post. 
    Return a JSON object with fields: "isAgriculture", "crop", and "cropType". 
    If it does not belong to agriculture, set "isAgriculture" to false.
    
    Post description: "${description}"
    
    Your response should be strictly in JSON format without any additional text.
    Example:
    {
      "isAgriculture": true,
      "crop": "paddy",
      "cropType": "Hybrid Paddy"
    }
   `;
    // // Step 2: Analyze the post using Gemini API (run function)
    // const geminiResponse = await run(prompt);

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

// Controller function to handle saving a post to the user's savedPosts array
export const savePost = async (userId, postId) => {
  try {
    // const { userId, postId } = req.body;

    // Step 1: Validate the incoming request data
    if (!userId || !postId) {
      return res
        .status(400)
        .json({ message: "User ID and Post ID are required!" });
    }

    // Step 2: Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Step 3: Check if the post already exists in savedPosts to avoid duplicates
    if (user.savedPosts.includes(postId)) {
      console.log("post ALREADY SAVED");
      // return res.status(400).json({ message: "Post already saved!" });
    }

    // Step 4: Add the post ID to the user's savedPosts array
    user.savedPosts.push(postId);
    await user.save();
    console.log("success");
    // Step 5: Return a success response
    // return res.status(200).json({
    //   message: "Post saved successfully!",
    //   savedPosts: user.savedPosts,
    // });
  } catch (error) {
    // Error handling
    console.error("Error saving post:", error);
    // return res.status(500).json({
    //   message: "An error occurred while saving the post.",
    //   error: error.message,
    // });
  }
};

export const addComment = async (userId, postId, message, isSolution) => {
  try {
    // Step 1: Create and save the comment
    const newComment = {
      userId: userId,
      postId,
      message,
      isSolution,
      createdAt: new Date(),
    };

    // Step 2: Find the post and user and add the comment
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post || !user) {
      throw new Error("Post or User not found.");
    }

    // Step 3: Add comment to the post and update comment count
    post.comments.push(newComment);
    post.numberOfComments = post.comments.length; // update numberOfComments

    // Step 4: Add the post ID to the user's commentedPosts array
    if (!user.commentedPosts.includes(postId)) {
      user.commentedPosts.push(postId);
    }

    // Save changes to the Post and User models
    await post.save();
    await user.save();

    return { success: true, message: "Comment added successfully." };
  } catch (error) {
    console.error("Error adding comment:", error.message);
    return { success: false, message: error.message };
  }
};

// Controller function to fetch all posts with comments by a specific user
export const getPostsWithUserComments = async (userId) => {
  try {
    // Step 1: Validate the input userId
    if (!userId) {
      throw new Error("User ID is required to fetch commented posts.");
    }

    // Step 2: Find posts with comments from the specific user
    const postsWithUserComments = await Post.find({
      "comments.userId": userId,
    })
      .populate("comments.userId", "username") // Populate comment user details if needed
      .populate("userId", "username"); // Populate post author details if needed

    // Step 3: Check if any posts were found
    if (!postsWithUserComments.length) {
      return {
        success: true,
        message: "No posts found with comments from this user.",
        posts: [],
      };
    }

    // Step 4: Return the posts with user comments
    return {
      success: true,
      message: "Posts with user comments fetched successfully.",
      posts: postsWithUserComments,
    };
  } catch (error) {
    console.error("Error fetching posts with user comments:", error.message);
    return { success: false, message: error.message };
  }
};
// Controller function to fetch all posts tagged as "problem" by a specific user
export const getProblemPostsByUser = async (userId) => {
  try {
    // Step 1: Validate the input userId
    if (!userId) {
      throw new Error("User ID is required to fetch problem posts.");
    }

    // Step 2: Find posts tagged as "problem" by the specific user
    const problemPosts = await Post.find({
      userId: userId, // Ensure user ID matches
      tag: "problem", // Only fetch posts with "problem" tag
    }).populate("userId", "username"); // Populate user details if needed

    // Step 3: Check if any problem posts were found
    if (!problemPosts.length) {
      return {
        success: true,
        message: "No problem posts found for this user.",
        posts: [],
      };
    }

    // Step 4: Return the problem posts
    return {
      success: true,
      message: "Problem posts fetched successfully.",
      posts: problemPosts,
    };
  } catch (error) {
    console.error("Error fetching problem posts:", error.message);
    return { success: false, message: error.message };
  }
};

export const getSavedPosts = async (userId) => {
  try {
    // const userId = req.user.id; // assuming you have user ID in req.user after authentication

    // Find user and populate the savedPosts field
    const user = await User.findById(userId).populate({
      path: "savedPosts", // refers to the savedPosts array in userSchema
      model: "Post", // name of the Post model
      select: "description media tag createdAt", // specify fields to return from each saved post
    });

    if (!user) {
      console.log("User not found");
      // return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log("posts", user.savedPosts);
    // Respond with saved posts
    // res.status(200).json({
    //   success: true,
    //   savedPosts: user.savedPosts,
    // });
  } catch (error) {
    console.log(error);
    // res.status(500).json({ success: false, message: error.message });
  }
};

export const getCommentsForPost = async (postId) => {
  try {
    // const { postId } = req.params;

    // Find the post by ID and retrieve its comments, sorted as required
    const post = await Post.findById(postId).populate({
      path: "comments.userId",
      select: "name avatar", // select only necessary fields from user for each comment
    });

    if (!post) {
      console.log("post not found");
      // return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Separate solution comments from normal comments
    const solutionComments = post.comments.filter(
      (comment) => comment.isSolution
    );
    const normalComments = post.comments.filter(
      (comment) => !comment.isSolution
    );

    // Combine solution comments first, followed by normal comments
    const sortedComments = [...solutionComments, ...normalComments];
    console.log("comments", sortedComments);
    // Send response with sorted comments
    // res.status(200).json({
    //   success: true,
    //   comments: sortedComments,
    // });
  } catch (error) {
    console.log(error);
    // res.status(500).json({ success: false, message: error.message });
  }
};

// postController.js

// Function to like a post
export const likePost = async (userId, postId) => {
  try {
    // const { postId } = req.body; // Get postId from request body
    // const userId = req.user.id; // Get user ID from the authenticated user

    // Find the post by ID
    const post = await Post.findById(postId);
    console.log("post", post);
    if (!post) {
      console.log("post not found");
      // return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the user has already liked the post
    if (post.likes != null && post.likes.includes(userId)) {
      console.log("already liked");
      // return res.status(400).json({ message: 'You have already liked this post' });
    }

    // Add the user ID to the post's likes array
    post.likes.push(userId);
    post.numberOfLikes += 1; // Increment the number of likes

    // Save the post
    await post.save();

    // Now, find the user and add the post ID to the likedPosts array
    const user = await User.findById(userId);
    user.likedPosts.push(postId); // Add the post ID to the likedPosts array

    // Save the user
    await user.save();
    console.log("liked done");
    // return res.status(200).json({ message: 'Post liked successfully', post });
  } catch (error) {
    console.log("liked error: " + error);
    // return res.status(500).json({ message: 'Server error', error });
  }
};

export async function loadUserPostsByCropType(userId) {
  try {
    // Step 1: Fetch user information
    const user = await User.findById(userId)
      .populate("likedPosts")
      .populate("savedPosts")
      .populate("commentedPosts")
      .exec();

    if (!user) {
      throw new Error("User not found");
    }
    console.log("ert", user);
    // Step 2: Prepare a map to count interactions by crop type
    const interactionCount = {};

    // Helper function to increment counts based on crop type
    const incrementCounts = (post, interactionType) => {
      const cropType = post.crop || "unknown"; // Use "unknown" if cropType is not specified
      if (!interactionCount[cropType]) {
        interactionCount[cropType] = { liked: 0, saved: 0, commented: 0 };
      }
      interactionCount[cropType][interactionType]++;
    };

    // Step 3: Count interactions for liked posts
    for (const post of user.likedPosts) {
      incrementCounts(post, "liked");
    }

    // Step 4: Count interactions for saved posts
    for (const post of user.savedPosts) {
      incrementCounts(post, "saved");
    }

    // Step 5: Count interactions for commented posts
    for (const post of user.commentedPosts) {
      incrementCounts(post, "commented");
    }

    // Step 6: Prepare a list of unique post IDs
    const postIds = [
      ...new Set([
        ...user.likedPosts,
        ...user.savedPosts,
        ...user.commentedPosts,
      ]),
    ];

    // Step 7: Fetch all unique posts from the database
    const posts = await Post.find({ _id: { $in: postIds } }).populate("userId");

    // Step 8: Sort posts based on interaction counts
    const sortedPosts = posts.sort((a, b) => {
      const aCropType = a.cropType || "unknown";
      const bCropType = b.cropType || "unknown";

      const aScore =
        (interactionCount[aCropType]?.liked || 0) * 3 +
        (interactionCount[aCropType]?.saved || 0) * 2 +
        (interactionCount[aCropType]?.commented || 0);

      const bScore =
        (interactionCount[bCropType]?.liked || 0) * 3 +
        (interactionCount[bCropType]?.saved || 0) * 2 +
        (interactionCount[bCropType]?.commented || 0);

      return bScore - aScore; // Higher score comes first
    });
    console.log(sortedPosts);
    return sortedPosts; // Return the sorted posts
  } catch (error) {
    console.error("Error loading posts:", error);
    throw new Error("Could not load posts");
  }
}

// Usage example
// loadUserPostsByCropType("USER_ID_HERE").then(posts => console.log(posts)).catch(error => console.error(error));
