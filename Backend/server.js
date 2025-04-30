import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/team.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import Ticket from "./models/Ticket.js"; // for handling chat messages in socket

dotenv.config({ path: "./.env" });
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/team", teamRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust based on your frontend port/domain
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Handle joining room (ticket)
  socket.on("join_room", (ticketId) => {
    socket.join(ticketId);
    console.log(`Socket ${socket.id} joined room ${ticketId}`);
  });

  // Handle message sending
  socket.on("send_message", async ({ ticketId, message }) => {
    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) return;

      ticket.messages.push(message);
      await ticket.save();

      // Emit the message to the ticket room
      io.to(ticketId).emit("receive_message", message);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit(
        "error_message",
        "There was an issue with sending your message."
      );
    }
  });

  // Handle closing the session (ticket)
  socket.on("close_session", (ticketId) => {
    io.to(ticketId).emit("session_closed");
    io.socketsLeave(ticketId);
    console.log(`Closed session for room ${ticketId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });

  // Handle ticket assignment to a teammate
  socket.on("ticket_assigned", ({ ticketId, memberId }) => {
    io.to(ticketId).emit("assigned_notification", { memberId, ticketId });
  });

  // Optional: handle errors
  socket.on("error", (error) => {
    console.error("Socket error:", error);
    socket.emit("error_message", "There was an issue with your connection.");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
