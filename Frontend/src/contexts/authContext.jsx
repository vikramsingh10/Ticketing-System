import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/authService";


export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const loggedInUser = await AuthService.getCurrentUser(token);
          if (loggedInUser) {
            setUser(loggedInUser);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const signup = async (firstName, lastName, email, password) => {
    try {
      const response = await AuthService.signup({
        firstName,
        lastName,
        email,
        password,
      });
      setUser(response.user);
      localStorage.setItem("token", response.token);
      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    }
  };

  const signin = async (email, password) => {
    try {
      const response = await AuthService.signin(email, password);
      setUser(response.user);
      localStorage.setItem("token", response.token);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, signin, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
