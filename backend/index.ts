import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import CombatTestRoutes from "./routes/character/test";
import { AuthRoutes } from "./routes/auth";

const app = express();
const port = 7893;

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:7895", "https://convergence.kiseki-miracle.dev"],
    credentials: true,
  },
});

const SECRET_KEY = "3uAqFu0ZrDs7Wur9eGx0HwTV6UFoASG2P5T6dqSyRhW";

app.use(
  cors({
    origin: ["http://localhost:7895", "https://convergence.kiseki-miracle.dev"],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (_req, res) => {
  res.send("Create your account at https://convergence.kiseki-miracle.dev");
});

CombatTestRoutes();
AuthRoutes();

// Handle client connections
io.on("connection", (socket) => {
  console.log("Client connected");

  // Handle messages from the client
  socket.on("message", (message) => {
    console.log("Message received:", message);

    // Send message to all clients, including the one that sent the message
    io.emit("message", message);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export { app, io, SECRET_KEY };
