import Ticket from "../models/Ticket.js";
import User from "../models/User.js";
import TeamMember from "../models/TeamMember.js";
import mongoose from "mongoose";
import Counter from "../models/Counter.js";

export const createTicket = async (req, res) => {
  try {
    const { title, assignedTo, name, phone, email } = req.body;

    let assignedMemberId = null;
    if (assignedTo) {
      const assignedMember = await TeamMember.findOne({ name: assignedTo });
      if (assignedMember) {
        assignedMemberId = assignedMember._id;
      }
    } else {
      const adminUser = await User.findOne({ role: "admin" });
      if (adminUser) {
        assignedMemberId = adminUser._id;
      }
    }

    let counter = await Counter.findOneAndUpdate(
      { name: "ticketNumber" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );

    const now = new Date();
    const year = now.getFullYear();
    const monthDay =
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0");

    const ticketNumber = `${year}-${String(counter.count).padStart(
      3,
      "0"
    )}${monthDay}`;

    const newTicket = new Ticket({
      title,
      
      assignedTo: assignedMemberId,
      createdBy: req.user?._id,
      name,
      phone,
      email,
      postedAt: new Date().toISOString(),
      time: new Date().toLocaleTimeString(),
      status: "unresolved",
      messages: [],
      ticketNumber,
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);
  } catch (error) {
    console.error("Error creating ticket", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate("assignedTo createdBy");
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getTicketById = async (req, res) => {
  const { ticketId } = req.params;
  if (!ticketId || !mongoose.Types.ObjectId.isValid(ticketId)) {
    return res.status(400).json({ message: "Invalid ticket ID" });
  }

  try {
    const ticket = await Ticket.findById(ticketId).populate(
      "assignedTo createdBy"
    );
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const addMessageToTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.messages.push(...req.body.messages);
    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error adding message to ticket", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.status = req.body.status;
    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    console.error("Error updating ticket status", error);
    res.status(500).json({ message: "Server Error" });
  }
};
