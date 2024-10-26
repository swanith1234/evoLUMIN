import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    minLength: [3, "Name must contain at least 3 characters!"],
    maxLength: [30, "Name cannot exceed 30 characters!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    validate: [validator.isEmail, "Please enter a valid email"],
    unique: true,
  },
  avatar: {
    type: String,
  },
  phone: {
    type: Number,
    required: [true, "Please enter your number"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [3, "Password must contain at least 3 characters!"],
    maxLength: [30, "Password cannot exceed 30 characters!"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "Please enter your role"],
    enum: ["farmer", "student", "mediator", "expert"],
  },
  state: {
    type: String,
    required: [true, "Please select your state"],
  },
  district: {
    type: String,
    required: [true, "Please select your district"],
  },
  mandal: {
    type: String,
    required: [true, "Please select your mandal"],
  },
  coordinates: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], required: true, index: "2dsphere" },
  },
  language: {
    type: String,
    required: [true, "Please select your language"],
  },

  crop: {
    type: String,
    required: [true, "Please enter your crop"],
  },
  productionStage: {
    type: String,
    required: [true, "Please enter your crop production stage"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  // Array to store references to tools booked along with service time
  bookedTools: [
    {
      toolTitle: {
        type: String,
      },
      serviceTime: {
        type: Date,
        required: [true, "Please provide the service time"],
      },
    },
  ],
  bookedToolTitles: [
    {
      type: String,
      // Reference to the Tool model
    },
  ],
  otp: {
    type: Number,
  },
  otpExpiry: {
    type: Date,
  },
  likedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Array to store IDs of posts the user liked
    },
  ],
  commentedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Array to store IDs of posts the user commented on
    },
  ],
  savedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Array to store IDs of posts the user saved
    },
  ],
});

// Hashing the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Comparing entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating a JWT token for authorization
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", userSchema);
