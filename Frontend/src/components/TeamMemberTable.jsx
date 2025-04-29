import React from "react";

const TeamMemberTable = ({ teamMembers, handleEdit, setConfirmDeleteId }) => {
  return (
    <table className="team-table">
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Role</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {teamMembers.map((member) => (
          <tr key={member._id}>
            <td>
              <img src="/assets/img.png" className="avatar" />
              {member.name}
            </td>
            <td>{member.phone}</td>
            <td>{member.email}</td>
            <td>{member.role}</td>
            <td>
              <span className="edit-icon" onClick={() => handleEdit(member)}>
                ✏️
              </span>
              <span
                className="delete-icon"
                onClick={() => setConfirmDeleteId(member._id)}
              >
                🗑️
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TeamMemberTable;
