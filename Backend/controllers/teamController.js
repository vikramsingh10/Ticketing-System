import bcrypt from "bcryptjs";
import User from "../models/User";
import TeamMember from "../models/TeamMember";

export const addTeamMember = async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;

    const existingMember = await TeamMember.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ message: "Team member already exists" });
    }

    const admin = await User.findOne({ role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMember = new TeamMember({
      name,
      email,
      phone,
      role: role || "Member",
      password: hashedPassword,
      avatar: "/assets/img.png",
    });

    await newMember.save();

    res.status(201).json(newMember);
  } catch (error) {
    console.error("Add Team Member Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
