import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, default: "Member" },
  phone: { type: String, default: "+1 (000) 000-0000" },
  avatar: { type: String, default: "/avatar1.png" },
  assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "TeamMember",
  default: null,
},

});

export default mongoose.model("TeamMember", TeamMemberSchema);
