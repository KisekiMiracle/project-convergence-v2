import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "node:http";
import CombatTestRoutes from "./routes/character/test";
import { AuthRoutes } from "./routes/auth";
import SocketRoutes from "./routes/socket";
import DBItemSeed from "./routes/db/seed/items";
import InventoryRoutes from "./routes/player/inventory";
import { Queue } from "bullmq";
import { redis } from "~/utils/redis";
import { startDiscordBot } from "./services/discord-bot";
import CharacterRoutes from "./routes/character";

const app = express();
const port = 7893;
const ALLOWED_ORIGINS = [
  "http://localhost:7895",
  "https://convergence.kiseki-miracle.dev",
  "https://hoppscotch.io", // ← add this for web Hoppscotch
  "http://localhost:3000", // ← add this if using Hoppscotch desktop app
];
const SECRET_KEY = "3uAqFu0ZrDs7Wur9eGx0HwTV6UFoASG2P5T6dqSyRhW";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  },
});

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
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

InventoryRoutes();
CharacterRoutes();

DBItemSeed();

// Handle client connections
io.on("connection", async (socket) => {
  console.log("Client connected");

  // Handle messages from the client
  socket.on("message", (message) => {
    console.log("Message received:", message);

    // Send message to all clients, including the one that sent the message
    io.emit("message", message);
  });

  await SocketRoutes(socket);
  console.log("User", socket.data.user);

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export const notificationQueue = new Queue("notifications", {
  connection: redis,
});

startDiscordBot();

export { app, io, SECRET_KEY };
