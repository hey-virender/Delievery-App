import axios from "axios";
import { refreshAccessToken } from "../utils/authUtils";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api", // Replace with your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for handling token refresh on 401 response
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error status is 401 (Unauthorized) and if the request hasn't been retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Refresh the access token
        await refreshAccessToken();

        // Get the new token from localStorage
        const newToken = localStorage.getItem("accessToken");

        // Update the default Authorization header for future requests
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;

        // Retry the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // retry the request
      } catch (err) {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }

        localStorage.removeItem("name");
        localStorage.removeItem("phone");
        localStorage.removeItem("accessToken");

        window.location.reload(true);
        return Promise.reject(err);
      }
    }

    // If the error is not related to token expiration, reject the promise
    return Promise.reject(error);
  }
);

export default axiosInstance;
