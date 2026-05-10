import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";

import expertRoutes from "./routes/expertRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

connectDB();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

app.use(expertRoutes);

app.use(bookingRoutes(io));

app.use(categoryRoutes);

server.listen(3000, () => {
  console.log("Server Running");
}); 