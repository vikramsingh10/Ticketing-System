import axios from "axios";

export const signupRequest = async (userData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error.response?.data || error.message;
  }
};

export const signinRequest = async (userData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/signin`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error during signin:", error);
    throw error.response?.data || error.message;
  }
};
