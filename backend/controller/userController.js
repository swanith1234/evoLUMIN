import { oauth2 } from "googleapis/build/src/apis/oauth2/index.js";
import { catchAsyncError } from "../middllewares/catchAsyncError.js";
import axios from "axios";
import { User } from "../models/user.js";
import { sendTokenuser } from "../utils/jwttoken.js";
import jwt from "jsonwebtoken";
import { oauth2client } from "../utils/googleConfig.js";
import dotenv from "dotenv";
dotenv.config({ path: "../env" });
import ErrorHandler from "../middllewares/error.js";
import twilio from "twilio";
export const userregister = catchAsyncError(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    role,
    password,
    location,
    crop,
    productionStage,
  } = req.body;
  console.log(name, email, phone, role, password);
  if (!name || !email || !phone || !role || !password || !location) {
    return next(new ErrorHandler("please fill full registration form"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already in use"));
  }
  console.log("userswa");

  const user = await User.create({
    name,
    email,
    phone,
    role,
    password,
    location,
    crop,
    productionStage,
  });
  sendTokenuser(user, 200, res, "success");
});
export const userlogin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide full login details", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("invalid email or password", 400));
  }

  sendTokenuser(user, 200, res, "user logged in successfully");
});

export const userlogout = catchAsyncError(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      sucess: true,
      message: "user loggedout successfully",
    });
});
export const getOneUser = async (req, res) => {
  const token = req.params.id;
  console.log("swanith", token);
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const userId = decoded.id;
  const user = await User.findById(userId);
  res.status(200).json({
    success: true,

    user, // Assuming results is an array of documents
  });
};
export const updateUser = async (req, res) => {
  const token = req.params.id;
  const { name, email, phone, password, college, LinkedIn, GitHub } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const userId = decoded.id;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        name,
        email,
        phone,
        password,
        college,
        LinkedIn,
        GitHub,
      },
    },
    { new: true } // This option returns the updated document
  );
  res.status(200).json({
    success: true,
    message: "Updated successfully",
    user,
  });
};
export const googleLogin = catchAsyncError(async (req, res) => {
  const { code } = req.query;
  const googleRes = await oauth2client.getToken(code);
  oauth2client.setCredentials(googleRes.tokens);
  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
  );
  const { email, name, picture } = userRes.data;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, name, avatar: picture });
  }
  sendTokenuser(user, 200, res, "success");
});
const phoneLogin = catchAsyncError(async (req, res, next) => {
  const { phone } = req.body;
  const user = await User.findOne({ phone: phone });
  if (!user) {
    return new ErrorHandler(
      "user not found with given number,please Register!!",
      404
    );
  }
});

const accountSid = process.env.TWILIO_SID; // Twilio Account SID
const authToken = process.env.TWILIO_AUTH_TOKEN; // Twilio Auth Token
const client = new twilio(accountSid, authToken);

// Send OTP Function
export const sendOtp = catchAsyncError(async (req, res, next) => {
  const { phone } = req.body;
  console.log(phone);
  try {
    // Generate a random 6-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Send the OTP via Twilio
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: "+18647148091", // Your Twilio phone number
      to: `+91 ${phone}`,
    });

    // Save OTP and expiry to the database (set expiry for 5 minutes)
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    await User.findOneAndUpdate(
      { phone }, // If the phone already exists, update it
      { phone, otp, otpExpiry },
      { upsert: true, new: true } // Insert if not exists, otherwise update
    );

    console.log(`OTP sent to ${phone}`);
    res.status(200).json({
      success: true,
      message: "Otp sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
});
export const verifyOtp = async (req, res, next) => {
  let { otp, phone } = req.body;

  otp = Number(otp);
  try {
    const user = await User.findOne({ phone: phone });

    if (!user) {
      return { success: false, message: "Phone number not found" };
    }

    if (user.otp === otp && user.otpExpiry > new Date()) {
      console.log("OTP verified successfully!");
      sendTokenuser(user, 200, res, "user logged in successfully");
    } else if (user.otpExpiry <= new Date()) {
      console.log("OTP expired");
      return { success: false, message: "OTP expired" };
    } else {
      console.log("Invalid OTP");
      return { success: false, message: "Invalid OTP" };
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "Error verifying OTP" };
  }
};
