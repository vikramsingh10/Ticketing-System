import axios from "axios";


const AuthService = {
  signin: async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/signin`,
        {
          email,
          password,
        }
      );
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
        {
          firstName,
          lastName,
          email,
          password,
        }
      );
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
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/auth/update`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },
};

export default AuthService;
