import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbConnection } from "./databases/dbConnection.js";
import promptRouter from "./routes/promptRoute.js";
import digitalRouter from "./routes/digital.js";
import userRouter from "./routes/userrouter.js";
import postRouter from "./routes/postRoute.js";
import toolsRouter from "./routes/toolRoute.js";
import marketRouter from "./routes/market.js";

// Load environment variables
dotenv.config({ path: "./config/config.env" });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  },
});

const port = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Routes
app.use("/api/v1", promptRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", postRouter);
app.use("/api/v1", toolsRouter);
app.use("/api/v1", digitalRouter);
app.use("/api/v1", marketRouter);

// Database connection
dbConnection();

// In-memory storage for all connected users' latest locations
const userLocations = {};

// Socket.io connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send the current list of all user locations to the newly connected client
  socket.emit("existingLocations", userLocations);

  // Listen for location updates from clients
  socket.on("sendLocation", (locationData) => {
    const { socketId, coordinates, speed, timestamp } = locationData;

    // Update or add the user's location data
    userLocations[socketId] = {
      coordinates,
      speed,
      timestamp,
    };

    // Broadcast the updated list of all user locations to all clients
    io.emit("locationUpdate", userLocations);
  });

  // Handle user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete userLocations[socket.id]; // Remove the user's location on disconnect

    // Broadcast the updated list of all user locations to all clients
    io.emit("locationUpdate", userLocations);
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// Example usage

export default app;
