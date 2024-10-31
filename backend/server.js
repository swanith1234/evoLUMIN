import express from "express";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./databases/dbConnection.js";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import { run } from "./geminiAiApi.js";
import promptRouter from "./routes/promptRoute.js";
import digitalRouter from "./routes/digital.js";
import userRouter from "./routes/userrouter.js";
import postRouter from "./routes/postRoute.js";
import toolsRouter from "./routes/toolRoute.js";
import { fetchPlayStoreMedia } from "./controller/digitalController.js";
import { loadUserPostsByCropType } from "./controller/postController.js";
import marketRouter from "./routes/market.js";
const app = express();
const port = process.env.PORT || 3000;
import { sendOtp } from "./controller/userController.js";
import { verifyOtp } from "./controller/userController.js";
import { digitalTool } from "./controller/digitalController.js";
import {
  addComment,
  getCommentsForPost,
  getPostsWithUserComments,
  getProblemPostsByUser,
  getSavedPosts,
  likePost,
  savePost,
} from "./controller/postController.js";
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);

app.use(cookieParser()); //used for parsing the cookies which hrlps in the authirization of user
app.use(express.json()); //used to parse the JSON type content that is being sent from the client to server

app.use(express.urlencoded({ extended: true })); //it parses the information present in the url
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
app.use("/api/v1", promptRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", postRouter);
app.use("/api/v1", toolsRouter);
app.use("/api/v1", digitalRouter);
app.use("/api/v1", marketRouter);
dbConnection();
// Example of calling the function with a userId
// digitalTool("Soil Health and Fertility", "english");
// Example usage
// const appLink =
//   "https://play.google.com/store/apps/details?id=com.soilscout.app"; // Replace with your app's link
// fetchPlayStoreMedia(appLink)
//   .then((media) => console.log(media))
//   .catch((err) => console.error(err));

// loadUserPostsByCropType("671baf70753da0069a7f73c1")
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

export default app;
