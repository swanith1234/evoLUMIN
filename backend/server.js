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
import toolsRouter from "./routes/toolRoute.js";
const app = express();
const port = process.env.PORT || 5000;
import { sendOtp } from "./controller/userController.js";
import { verifyOtp } from "./controller/userController.js";
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
dbConnection();
// Example of calling the function with a userId

export default app;
