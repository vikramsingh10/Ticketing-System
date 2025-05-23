import React from "react";

const TeamMemberModal = ({
  formData,
  handleChange,
  handleSave,
  editingMember,
  setShowModal,
  setEditingMember,
}) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{editingMember ? "Edit Team Member" : "Add Team Members"}</h3>
        <p>
          Talk with colleagues in a group chat. Messages in this group are only
          visible to its participants. New teammates may only be invited by the
          administrators.
        </p>
        <label className="label" htmlFor="username">User name</label>
        <input
          type="text"
          name="name"
          placeholder="User name"
          value={formData.name}
          onChange={handleChange}
        />
        <label className="label" htmlFor="phone">Phone Number</label>
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />
        <label className="label" htmlFor="email">Email ID</label>
        <input
          type="email"
          name="email"
          placeholder="Email ID"
          value={formData.email}
          onChange={handleChange}
        />
        <label className="label" htmlFor="dropdown">Designation</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </select>

        <div className="modal-buttons">
          <button
            className="cancel-btn"
            onClick={() => {
              setShowModal(false);
              setEditingMember(null);
            }}>
            Cancel
          </button>
          <button className="save-btn" onClick={handleSave}>
            {editingMember ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal;
