import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/team.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import Ticket from "./models/Ticket.js";

dotenv.config({ path: "./.env" });
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://ticketing-system-fngx1ex8k-vikramsingh10s-projects.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/team", teamRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join_room", (ticketId) => {
    socket.join(ticketId);
    console.log(`Socket ${socket.id} joined room ${ticketId}`);
  });

  socket.on("send_message", async ({ ticketId, message }) => {
    try {
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) return;

      ticket.messages.push(message);
      await ticket.save();

      io.to(ticketId).emit("receive_message", message);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit(
        "error_message",
        "There was an issue with sending your message."
      );
    }
  });

  socket.on("close_session", (ticketId) => {
    io.to(ticketId).emit("session_closed");
    io.socketsLeave(ticketId);
    console.log(`Closed session for room ${ticketId}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });

  socket.on("ticket_assigned", ({ ticketId, memberId }) => {
    io.to(ticketId).emit("assigned_notification", { memberId, ticketId });
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
    socket.emit("error_message", "There was an issue with your connection.");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
