import React from "react";
import PropTypes from "prop-types";
import axios from "../api/axios";
import { useShowPopup } from "../utils/popupHandler";
const AddToCartButton = ({ product, quantity, setQuantity }) => {
  const setPopup = useShowPopup();
  const handleAddToCart = async () => {
    try {
      const response = await axios.post("/addToCart", { product, quantity });
      setPopup("message", "Product added to cart successfully");
      setQuantity(1);
    } catch (error) {
      setPopup("error", "Failed to add product to cart");
      console.log(error);
    }
  };

  return (
    <button
      className="bg-red-500 w-36 h-10 rounded-lg text-white font-bold"
      onClick={handleAddToCart}
    >
      Add to Cart
    </button>
  );
};

AddToCartButton.propTypes = {
  product: PropTypes.object.isRequired,
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
};

export default AddToCartButton;
