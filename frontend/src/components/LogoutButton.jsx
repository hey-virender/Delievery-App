import React from "react";
import { useNavigate } from "react-router-dom";

import axios from "../api/axios";

const LogoutButton = () => {
  const navigate = useNavigate();
  const handleLogOut = async () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    const response = await axios.post("/logout");
    if (response.status == 200) {
      localStorage.removeItem("name");
      localStorage.removeItem("phone");
      localStorage.removeItem("accessToken");
      navigate("/");
      window.location.reload(true);
    }
  };
  return (
    <div
      className="absolute top-5 right-3 text-sm  text-black font-bold h-12 w-16 text-center"
      onClick={handleLogOut}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 mx-auto text-red-500"
      >
        <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C15.2713 2 18.1757 3.57078 20.0002 5.99923L17.2909 5.99931C15.8807 4.75499 14.0285 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C14.029 20 15.8816 19.2446 17.2919 17.9998L20.0009 17.9998C18.1765 20.4288 15.2717 22 12 22ZM19 16V13H11V11H19V8L24 12L19 16Z"></path>
      </svg>
      Logout
    </div>
  );
};

export default LogoutButton;