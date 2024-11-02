// socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  autoConnect: false, // Only connect explicitly
});

export default socket;
