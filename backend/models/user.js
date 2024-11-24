import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Name must contain at least 3 characters!"],
    maxLength: [30, "Name cannot exceed 30 characters!"],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please enter a valid email"],
    unique: true,
  },
  avatar: {
    type: String,
  },
  phone: {
    type: Number,
    unique: true,
  },
  password: {
    type: String,
    minLength: [3, "Password must contain at least 3 characters!"],
    maxLength: [30, "Password cannot exceed 30 characters!"],
    select: false,
  },
  role: {
    type: String,
    enum: ["farmer", "student", "mediator", "expert"],
  },
  state: {
    type: String,
  },
  district: {
    type: String,
  },
  mandal: {
    type: String,
  },
  coordinates: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" },
  },
  language: {
    type: String,
  },
  crop: {
    type: String,
  },
  productionStage: {
    type: String,
  },
  // cropQuantityForSale: {
  //   type: Number,
  // },
  // cropImage: {
  //   type: String,
  // },
  // cropVideo: {
  //   type: String,
  // },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  bookedTools: [
    {
      toolTitle: {
        type: String,
      },
      serviceTime: {
        type: Date,
      },
    },
  ],
  bookedToolTitles: [
    {
      type: String,
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
      ref: "Post",
    },
  ],
  commentedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  savedPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  cropsForSale: [
    {
      title: {
        type: String,
        required: [true, "Crop title is required"],
      },
      description: {
        type: String,
        required: [true, "Crop description is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Crop quantity is required"],
        min: [1, "Quantity must be at least 1"],
      },
      images: [
        {
          type: String, // URL or file path to the image
        },
      ],
      video: {
        type: String, // URL or file path to the video
      },
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
