import React from "react";
import { useSelector } from "react-redux";
const PopUpBox = () => {
  const { message, error } = useSelector((state) => state.popup);
  return (
    <div className="relative z-50">
      {message && (
        <div className=" absolute top-4 bg-blue-500 text-center text-white rounded-lg left-1/2 -translate-x-1/2 h-10 w-full">
          {message}
        </div>
      )}
      {error && (
        <div className=" absolute top-4 bg-red-500 text-center text-white rounded-lg left-1/2 -translate-x-1/2 h-10 w-full">
          {error}
        </div>
      )}
    </div>
  );
};

export default PopUpBox;
