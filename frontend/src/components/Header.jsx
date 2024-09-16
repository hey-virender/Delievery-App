import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const name = localStorage.getItem("name");
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center">
      <div className="logo h-12" onClick={() => navigate("/")}>
        <img className="w-full h-full object-contain" src="/logo.png" alt="" />
      </div>
      <div className="font-bold" onClick={() => navigate("/profile")}>
        {name}
      </div>
    </div>
  );
};

export default Header;
