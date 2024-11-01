import axios from "../api/axios";
export const refreshAccessToken = async () => {
  try {
    const response = await axios.post("/refresh-token");
    const { accessToken } = response.data;

    // Store new access token
    localStorage.setItem("accessToken", accessToken);
  } catch (error) {
    localStorage.removeItem("accessToken");
    
    // handle the error based on your logic (e.g., logout the user)
  }
};
