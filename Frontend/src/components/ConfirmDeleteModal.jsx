import React from "react";

const ConfirmDeleteModal = ({ confirmDeleteId, setConfirmDeleteId, handleDeleteConfirm }) => {
  return (
    confirmDeleteId && (
      <div className="modal-backdrop">
        <div className="modal">
          <h3>This team member will be deleted</h3>
          <p>Are you sure you want to delete this member?</p>
          <div className="modal-buttons">
            <button
              className="cancel-btn"
              onClick={() => setConfirmDeleteId(null)}
            >
              Cancel
            </button>
            <button className="save-btn" onClick={handleDeleteConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ConfirmDeleteModal;
