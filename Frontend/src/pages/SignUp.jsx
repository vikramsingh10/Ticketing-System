import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import "../styles/Signup.css";

const Signup = () => {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      agreeToTerms,
    } = formData;

    // Basic field validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters long, include an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Terms and conditions validation
    if (!agreeToTerms) {
      setError("You must agree to the Terms of Use and Privacy Policy.");
      return;
    }

    try {
      const result = await signup(firstName, lastName, email, password);
      if (result.success) {
        setMessage("Account created successfully! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setError(result.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="main-container">
      <div className="l-section">
        <img src="./assets/logo.png" alt="Hubly Logo" />
        <div className="form-container">
          <div className="heading">
            <h2>Create an account</h2>
            <p className="signup-link">
              <a href="/login">Sign in instead</a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <div className="input-group">
              <label className="label" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="label" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group password-group">
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group password-group">
              <label className="label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="checkbox-group">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
              />
              <label htmlFor="agreeToTerms">
                By creating an account, I agree to our <span>Terms of Use</span>{" "}
                and <span>Privacy Policy</span>.
              </label>
            </div>

            <button type="submit" className="login-button">
              Create an account
            </button>
          </form>

          <p className="b-text">
            This site is protected by reCAPTCHA and the{" "}
            <span style={{ textDecoration: "underline" }}>
              Google Privacy Policy
            </span>{" "}
            and{" "}
            <span style={{ textDecoration: "underline" }}>
              Terms of Service
            </span>{" "}
            apply.
          </p>
        </div>
      </div>
      <div className="r-section"></div>
    </div>
  );
};

export default Signup;
