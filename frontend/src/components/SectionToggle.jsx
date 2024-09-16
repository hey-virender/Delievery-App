import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSection } from "../slices/productSlice";
const SectionToggle = () => {
  const dispatch = useDispatch();
  const section = useSelector((state) => state.product.section);
  return (
    <div className="relative flex items-center justify-around h-16 w-full font-bold text-lg border-b-2 border-black">
      <div
        className={`absolute top-12 h-2 w-2 rounded-full bg-black transition-all duration-500 ease-linear ${
          section == "vegetables" ? "-translate-x-20" : "translate-x-20"
        }`}
      ></div>
      <div
        onClick={() => dispatch(setSection("vegetables"))}
        className={`${section == "grocery" && "font-normal text-gray-700"}`}
      >
        Vegetables
      </div>
      <div
        onClick={() => dispatch(setSection("grocery"))}
        className={`${section == "vegetables" && "font-normal text-gray-700"}`}
      >
        Groceries
      </div>
    </div>
  );
};

export default SectionToggle;
