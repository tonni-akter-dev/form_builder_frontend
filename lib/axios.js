import axios from "axios";

// Create an Axios instance with default configuration
const api = axios.create({
  // baseURL: "https://form-backend-y39u.onrender.com/api",
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request Interceptor ---
// This function will be called before every request is sent
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");

    // If a token exists, attach it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // You must return the config object
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  },
);

// --- Optional: Response Interceptor ---
// This can be used to handle common responses, like 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx causes this function to trigger
    if (error.response?.status === 401) {
      // Handle 401 Unauthorized error
      // For example, log the user out and redirect to the login page
      console.error("Unauthorized! Logging out...");
      localStorage.removeItem("token"); // Clear the token
      window.location.href = "/login"; // Redirect to login
    }
    return Promise.reject(error);
  },
);

export default api;
