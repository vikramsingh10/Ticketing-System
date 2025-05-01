import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/authContext";
import "../styles/Setting.css";
const Setting = () => {
  const { user } = useContext(AuthContext);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="setting-page">
      <h2>Settings</h2>
      <div className="setting-form-container">
        <form onSubmit={handleSave} className="setting-form">
          <div className="edit-profile-head">
            <p>
              <span>Edit Profile</span>
            </p>
          </div>

          <div className="form-group">
            <label>First name</label>
            <div className="input-with-icon">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Last name</label>
            <div className="input-with-icon">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-with-icon">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <span className="info-icon" title="Email cannot be changed">
                i
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
              <span className="info-icon" title="User will log out immediately">
                i
              </span>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-with-icon">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
              />
              <span className="info-icon" title="User will log out immediately">
                i
              </span>
            </div>
          </div>
          <div className="save-button-container">
            <button type="submit" className="save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Setting;
