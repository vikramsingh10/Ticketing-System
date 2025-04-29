import React, { useState, useEffect } from "react";
import {
  getAllTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../services/teamService";
import TeamMemberModal from "../components/TeamMemberModal";
import TeamMemberTable from "../components/TeamMemberTable";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import "../styles/Team.css";

const Team = () => {
  const [showModal, setShowModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Member",
    
  });
  const [editingMember, setEditingMember] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const members = await getAllTeamMembers();
      setTeamMembers(members);
    } catch (err) {
      console.error("Error fetching team members:", err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const duplicateMember = teamMembers.find(
        (member) =>
          (member.email === formData.email ||
            member.phone === formData.phone) &&
          (!editingMember || member._id !== editingMember._id)
      );

      if (duplicateMember) {
        alert("A member with the same email or phone number already exists.");
        return;
      }

      if (editingMember) {
        const updated = await updateTeamMember(editingMember._id, formData);
        setTeamMembers((prev) =>
          prev.map((m) => (m._id === updated._id ? updated : m))
        );
      } else {
        const newMember = {
          ...formData,
          phone: formData.phone,
          avatar: "/assets/img.png",
        };
        const added = await addTeamMember(newMember);
        setTeamMembers((prev) => [...prev, added]);
      }

      setShowModal(false);
      setEditingMember(null);
      setFormData({
        name: "",
        phone: "",
        email: "",
        role: "Member",
        
      }); 
    } catch (err) {
      console.error("Error occurred:", err);
      let errorMessage = "Error saving member.";

      if (err.response) {
        try {
          const data = await err.response.json();
          errorMessage = data?.error || "Error saving member.";
        } catch (error) {
          errorMessage = "An unknown error occurred.";
        }
      }

      alert(errorMessage);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      phone: member.phone,
      email: member.email,
      role: member.role,
     
    });
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTeamMember(confirmDeleteId);
      setTeamMembers((prev) => prev.filter((m) => m._id !== confirmDeleteId));
      setConfirmDeleteId(null);
    } catch (err) {
      console.error("Error deleting member:", err.message);
    }
  };

  return (
    <div className="team-container">
      <h2>Team</h2>

      {teamMembers.length === 0 ? (
        <p>No team members added yet.</p>
      ) : (
        <TeamMemberTable
          teamMembers={teamMembers}
          handleEdit={handleEdit}
          setConfirmDeleteId={setConfirmDeleteId}
        />
      )}

      <button className="add-btn" onClick={() => setShowModal(true)}>
        ➕ Add Team members
      </button>

      {showModal && (
        <TeamMemberModal
          formData={formData}
          handleChange={handleChange}
          handleSave={handleSave}
          editingMember={editingMember}
          setShowModal={setShowModal}
          setEditingMember={setEditingMember}
        />
      )}

      <ConfirmDeleteModal
        confirmDeleteId={confirmDeleteId}
        setConfirmDeleteId={setConfirmDeleteId}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Team;
