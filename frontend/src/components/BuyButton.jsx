import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
const BuyButton = ({ product,quantity }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() =>
        navigate("/complete-order", {
          state: { orderType: "single", product: product,quantity: quantity, }, 
        })
      }
      className="bg-emerald-500 w-28 h-10 rounded-lg text-white font-bold"
    >
      Buy
    </button>
  );
};

BuyButton.propTypes = {
  product: PropTypes.object.isRequired,
  quantity: PropTypes.number.isRequired,
};

export default BuyButton;
