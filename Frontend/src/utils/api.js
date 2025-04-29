import axios from "axios";

const API_URL = "http://localhost:5000";

export const signupRequest = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error.response?.data || error.message;
  }
};

export const signinRequest = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signin`, userData);
    return response.data;
  } catch (error) {
    console.error("Error during signin:", error);
    throw error.response?.data || error.message;
  }
};
