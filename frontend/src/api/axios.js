import axios from "axios";

const api = axios.create({
  baseURL: "https://project-hd.onrender.com",
  // baseURL: "http://localhost:3000", // your backend URL (use localhost for testing)
});

// Helper to set token in headers dynamically
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
