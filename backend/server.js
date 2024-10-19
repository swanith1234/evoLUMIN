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
import userRouter from "./routes/userrouter.js";
import postRouter from "./routes/postRoute.js";
import { getToolsByUserCrop } from "./controller/toolController.js";
const app = express();
const port = process.env.PORT || 5000;

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
dbConnection();
// Example of calling the function with a userId
const userId = '64e4f3b714ab5c23b121d112'; // Sample user ID
getToolsByUserCrop(userId)
  .then((response) => {
    if (response.success) {
      console.log("Tools found:", response.tools);
    } else {
      console.log("Error:", response.message);
    }
  })
  .catch((error) => {
    console.log("Error:", error);
  });

export default app;
