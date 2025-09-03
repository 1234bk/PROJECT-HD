import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: "http://localhost:3000", // your backend URL
  withCredentials: true, // important for cookies
});

// Add Authorization header if token in cookie
// api.interceptors.request.use((config) => {
//   const token = Cookies.get("token"); // or whatever you store in cookie
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;
