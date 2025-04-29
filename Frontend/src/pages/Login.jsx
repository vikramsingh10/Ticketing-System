import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { AuthContext } from "../contexts/authContext";
import { Notification } from "../utils/notification.utils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { signin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const result = await signin(email, password); 
      if (result.success) {
        navigate("/dashboard");
      } else {
        Notification("error", result.message || "Invalid email or password.");
      }
    } catch (err) {
      Notification("error", err.message || "Login failed.");
    }
  };

  return (
    <div className="main-container">
      <div className="left-section">
        <img className="logo" src="./assets/logo.png" alt="Hubly Logo" />
        <div className="signin-wrapper">
          <div className="signin-container">
            <h2>Sign in to your Plexify</h2>
            <form onSubmit={handleSubmit} className="login-form">
              {error && <p className="error-message">{error}</p>}
              <div className="input-group">
                <label className="label" htmlFor="email">
                  Username
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label className="label" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">
                Log in
              </button>
            </form>
            <p className="signup-link">
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
          </div>
        </div>
        <p className="bottom-text">
          This site is protected by reCAPTCHA and the{" "}
          <span style={{ textDecoration: "underline" }}>
            Google Privacy Policy
          </span>{" "}
          and{" "}
          <span style={{ textDecoration: "underline" }}>Terms of Service</span>{" "}
          apply.
        </p>
      </div>
      <div className="right-section"></div>
    </div>
  );
};

export default Login;
