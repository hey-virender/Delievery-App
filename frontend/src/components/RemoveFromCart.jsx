import React from "react";
import axios from "../api/axios";
import PropTypes from "prop-types";
import { useShowPopup } from "../utils/popupHandler";
const RemoveFromCart = ({ product }) => {
  const showPopup = useShowPopup();
  const handleRemoveFromCart = async () => {
    try {
      const response = await axios.post("/removeFromCart", {
        productId: product._id,
      });
      if (response.status == 200) {
        showPopup("message", "Successfully removed");
      }
    } catch (error) {
      console.error(error);
      showPopup("error", "Failed to remove from cart");
    }finally{
      window.location.reload()
    }
  };
  return (
    <button className=" text-red-600 h-8 w-6 rounded-xl " onClick={handleRemoveFromCart}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-full w-full"
      >
        <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM13.4142 13.9997L15.182 15.7675L13.7678 17.1817L12 15.4139L10.2322 17.1817L8.81802 15.7675L10.5858 13.9997L8.81802 12.232L10.2322 10.8178L12 12.5855L13.7678 10.8178L15.182 12.232L13.4142 13.9997ZM9 4V6H15V4H9Z"></path>
      </svg>
    </button>
  );
};

RemoveFromCart.propTypes = {
  product: PropTypes.object.isRequired,
};

export default RemoveFromCart;
