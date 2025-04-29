import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["admin", "user", "chatbot"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ["resolved", "unresolved"],
      default: "unresolved",
    },
    priority: { type: String, default: "normal" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "TeamMember" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    postedAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    messages: [messageSchema],
    ticketNumber: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
