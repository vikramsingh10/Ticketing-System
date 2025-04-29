import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/team.js";
import ticketRoutes from "./routes/ticketRoutes.js";
dotenv.config({ path: "./.env" });

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/team", teamRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on the port ${PORT}`));
