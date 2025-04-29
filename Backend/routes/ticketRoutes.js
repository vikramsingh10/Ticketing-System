import express from "express";
import {
  createTicket,
  getAllTickets,
  getTicketById,
  addMessageToTicket,
  updateTicketStatus,
} from "../controllers/ticketController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import Ticket from "../models/Ticket.js";
import mongoose from "mongoose";
const router = express.Router();

router.post("/", authMiddleware, createTicket);

router.get("/", authMiddleware, getAllTickets);
router.get("/:ticketId", authMiddleware, getTicketById);
router.put("/:ticketId/messages", authMiddleware, addMessageToTicket);
router.put("/:ticketId/status", authMiddleware, updateTicketStatus);
export default router;

router.delete("/:ticketId", authMiddleware, async (req, res) => {
  const { ticketId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(ticketId)) {
    return res.status(400).json({ message: "Invalid ticket ID format" });
  }

  try {
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);

    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting ticket", error });
  }
});

router.put("/:ticketId/assign", async (req, res) => {
  const { teamMemberId } = req.body;

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.ticketId,
      { assignedTo: teamMemberId },
      { new: true }
    ).populate("assignedTo");

    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
