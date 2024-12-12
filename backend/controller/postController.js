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
    const geminiResponse = await run(prompt);

    if (!geminiResponse) {
      return res
        .status(500)
        .json({ message: "Failed to analyze the post with Gemini API." });
    }

    // Step 3: Extract data from the Gemini API response
    const { isAgriculture, crop, cropType } = geminiResponse;
    // const isAgriculture = true;
    // const crop = "paddy";
    // const cropType = "local";

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
export const savePost = async (req, res) => {
  try {
    const { userId, postId } = req.body;

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
      return res.status(400).json({ message: "Post already saved!" });
    }

    // Step 4: Add the post ID to the user's savedPosts array
    user.savedPosts.push(postId);
    await user.save();
    console.log("success");
    // Step 5: Return a success response
    return res.status(200).json({
      message: "Post saved successfully!",
      savedPosts: user.savedPosts,
    });
  } catch (error) {
    // Error handling
    console.error("Error saving post:", error);
    return res.status(500).json({
      message: "An error occurred while saving the post.",
      error: error.message,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { userId, postId, message, isSolution, commentMedia } = req.body;
    // Step 1: Create and save the comment
    const newComment = {
      userId: userId,
      postId,
      message,
      isSolution,
      commentMedia,
      createdAt: new Date(),
    };
    console.log(newComment);
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
    console.log("success");

    res.status(200).json({
      success: true,
      message: "Comment added successfully.",
    });
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

export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;
    console.log("getCommentsForPost", postId);
    // Find the post by ID and retrieve its comments with populated user details
    const post = await Post.findById(postId).populate({
      path: "comments.userId",
      select: "name role avatar", // Include name, role, and avatar fields from the user
    });

    if (!post) {
      console.log("Post not found");
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Map through the comments to format the required details
    const formattedComments = post.comments.map((comment) => ({
      user: {
        name: comment.userId.name,
        role: comment.userId.role,
        avatar: comment.userId.avatar,
      },
      isSolution: comment.isSolution,
      createdAt: comment.createdAt,
      text: comment.message,
      commentMedia: comment.commentMedia, // assuming comment has a 'text' field for the comment content
    }));

    // Separate solution comments from normal comments
    const solutionComments = formattedComments.filter(
      (comment) => comment.isSolution
    );
    const normalComments = formattedComments.filter(
      (comment) => !comment.isSolution
    );

    // Combine solution comments first, followed by normal comments
    const sortedComments = [...solutionComments, ...normalComments];

    console.log("Comments:", sortedComments);

    // Send response with sorted comments
    res.status(200).json({
      success: true,
      comments: sortedComments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// postController.js

// Function to like a post
export const likePost = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    console.log("likePost", postId, userId);
    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("rupee");
    // Check if the user has already liked the post
    const userLikedIndex = post.likes ? post.likes.indexOf(userId) : -1;

    if (userLikedIndex !== -1) {
      // User has already liked the post, so we unlike it
      post.likes.splice(userLikedIndex, 1); // Remove user ID from likes array
      post.numberOfLikes -= 1; // Decrement the number of likes

      // Remove post ID from user's likedPosts array
      const likedPostIndex = user.likedPosts.indexOf(postId);
      if (likedPostIndex !== -1) {
        user.likedPosts.splice(likedPostIndex, 1);
      }
      await Post.findByIdAndUpdate(postId, {
        likes: post.likes,
        numberOfLikes: post.numberOfLikes,
      });

      await User.findByIdAndUpdate(userId, {
        likedPosts: user.likedPosts,
      });

      return res
        .status(200)
        .json({ message: "Post unliked successfully", post });
    } else {
      // User has not liked the post yet, so we like it
      post.likes.push(userId);
      post.numberOfLikes += 1;

      // Add post ID to user's likedPosts array
      user.likedPosts.push(postId);

      await post.save();
      await user.save();

      return res.status(200).json({ message: "Post liked successfully", post });
    }
  } catch (error) {
    console.log("Error occurred: " + error);
    return res.status(500).json({ message: "Server error", error });
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

    // Step 3: Count interactions for liked, saved, and commented posts
    for (const post of user.likedPosts) incrementCounts(post, "liked");
    for (const post of user.savedPosts) incrementCounts(post, "saved");
    for (const post of user.commentedPosts) incrementCounts(post, "commented");

    // Step 4: Determine the crop type with the most interactions
    const mostInteractedCropType = Object.keys(interactionCount).reduce(
      (max, cropType) => {
        const score =
          (interactionCount[cropType].liked || 0) * 3 +
          (interactionCount[cropType].saved || 0) * 2 +
          (interactionCount[cropType].commented || 0);
        return score > max.score ? { cropType, score } : max;
      },
      { cropType: "unknown", score: 0 }
    ).cropType;

    // Step 5: Prepare a list of unique post IDs
    const postIds = [
      ...new Set([
        ...user.likedPosts,
        ...user.savedPosts,
        ...user.commentedPosts,
      ]),
    ];

    // Step 6: Fetch all unique posts the user has interacted with
    const interactedPosts = await Post.find({ _id: { $in: postIds } }).populate(
      "userId"
    );

    // Step 7: Fetch posts not interacted with by the user but matching the most interacted crop type
    const nonInteractedPosts = await Post.find({
      _id: { $nin: postIds }, // Exclude already interacted posts
      cropType: mostInteractedCropType,
    }).populate("userId");

    // Step 8: Fetch all remaining posts with other crop types
    const remainingPosts = await Post.find({
      _id: { $nin: postIds }, // Exclude already interacted posts
      cropType: { $ne: mostInteractedCropType }, // Exclude most interacted crop type
    }).populate("userId");

    // Step 9: Sort interacted posts based on interaction counts, and then by creation date
    const sortedInteractedPosts = interactedPosts.sort((a, b) => {
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

      // First sort by interaction score, then by creation date (most recent first)
      if (bScore !== aScore) {
        return bScore - aScore;
      }
      return new Date(b.createdAt) - new Date(a.createdAt); // Sort by createdAt (desc)
    });

    // Step 10: Sort non-interacted and remaining posts by creation date (most recent first)
    const sortedNonInteractedPosts = nonInteractedPosts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const sortedRemainingPosts = remainingPosts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Step 11: Combine the posts in order of priority
    const allPosts = [
      ...sortedNonInteractedPosts,
      ...sortedRemainingPosts,
      ...sortedInteractedPosts,
    ];

    return allPosts; // Return the combined posts list
  } catch (error) {
    console.error("Error loading posts:", error);
    throw new Error("Could not load posts");
  }
}

export async function getPostById(req, res) {
  try {
    const { postId } = req.params;
    console.log("postId", postId);

    const post = await Post.findById(postId);
    if (post) {
      console.log("post", post);
      return res.json({
        success: true,
        message: "Saved Post details fetched successfully.",
        post,
      });
    }

    return res.json({
      success: false,
      message: "Post not found.",
    });
  } catch (err) {
    console.log("Error getting post", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching post details.",
    });
  }
}

// Usage example
// loadUserPostsByCropType("USER_ID_HERE").then(posts => console.log(posts)).catch(error => console.error(error));
