import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
const AuthService = {
  signin: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/signin`, {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  signup: async ({ firstName, lastName, email, password }) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        firstName,
        lastName,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },
  updateProfile: async (updatedData) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(`${API_URL}/update`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },
};

export default AuthService;
