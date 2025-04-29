import express from "express";
import TeamMember from "../models/TeamMember.js";
import { validateTeamMember } from "../middlewares/validateTeamMember.js"; // Import validation
import Ticket from "../models/Ticket.js";

const router = express.Router();

// Get all team members
router.get("/", async (req, res) => {
  try {
    const members = await TeamMember.find();
    res.status(200).json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new team member
router.post("/", validateTeamMember, async (req, res) => {
  const { email, phone, name, role } = req.body;

  try {
    const existingMember = await TeamMember.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingMember) {
      return res.status(400).json({
        error:
          "Team member already exists with the same email or phone number.",
      });
    }

    const newMember = new TeamMember(req.body);
    await newMember.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a team member
router.delete("/:id", async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Member not found." });
    }
    res.status(200).json({ message: "Team member deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a team member
router.put("/:id", validateTeamMember, async (req, res) => {
  const { email, phone, name, role } = req.body;

  try {
    const existingMember = await TeamMember.findOne({
      _id: { $ne: req.params.id },
      $or: [{ email }, { phone }],
    });

    if (existingMember) {
      return res.status(400).json({
        error:
          "Another member already exists with the same email or phone number.",
      });
    }

    const updatedMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ error: "Member not found." });
    }

    res.status(200).json(updatedMember);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;

