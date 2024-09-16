import React from "react";
import PropTypes from "prop-types";

const QuantitySelector = ({ quantity, setQuantity }) => {
  const handleQuantityChange = (action) => {
    if (action === "add") {
      setQuantity((prevQuantity) => prevQuantity + 1);
    } else if (action === "subtract" && quantity > 1) {
      if (quantity > 1) {
        setQuantity((prevQuantity) => prevQuantity - 1);
      } else {
        setQuantity(1);
      }
    }
  };
  return (
    <div className="flex gap-2">
      <div
        className="minus-icon h-8 w-14 bg-red-500 rounded-lg"
        onClick={() => handleQuantityChange("subtract")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-full text-white mx-auto"
        >
          <path d="M5 11V13H19V11H5Z"></path>
        </svg>
      </div>
      <input
        type="number"
        value={quantity}
        readOnly
        className="quantity-input border-[0.5vh] border-red-500 w-12 text-center font-bold rounded-xl "
      />

      <div
        className="plus-icon h-8 w-14 bg-red-500 rounded-lg"
        onClick={() => handleQuantityChange("add")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-full text-white mx-auto"
        >
          <path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path>
        </svg>
      </div>
    </div>
  );
};

QuantitySelector.propTypes = {
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
};

export default QuantitySelector;
