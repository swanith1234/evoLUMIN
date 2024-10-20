import mongoose from "mongoose";
const { Schema } = mongoose;

// Schema for storing tool reviews and ratings
const reviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: "String" },
  rating: { type: Number, required: true, min: 0, max: 5 },
  comment: { type: String },
});

// Schema for tool details
const toolSchema = new Schema({
  images: [{ type: String, required: true }], // Array of image URLs
  title: { type: String, required: true },
  description: { type: String, required: true },
  detailsAndSpecifications: { type: String, required: true },
  bookedUserIds: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who booked the service
  numberOfUsersBooked: { type: Number, default: 0 },
  reviews: [reviewSchema],
  phone: { type: Number, default: 9347562927 }, // Array of reviews
});

// Schema for production stages in a crop's lifecycle
const productionStageSchema = new Schema({
  stageName: { type: String, required: true },
  tools: [toolSchema], // Array of tools used in this production stage
});

// Schema for storing crop details
const cropSchema = new Schema({
  cropName: { type: String, required: true },
  productionStages: [productionStageSchema], // Array of production stages for each crop
});

// Schema for agriculture details
const agricultureSchema = new Schema({
  agricultureType: { type: String, required: true },
  crops: [cropSchema], // Array of crops under this agriculture type
});

// Create Mongoose models for each schema
export const Tools = mongoose.model("Tools", agricultureSchema);
