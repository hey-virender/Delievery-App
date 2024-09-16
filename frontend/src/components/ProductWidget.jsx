import React from "react";
import PropTypes from "prop-types";
import axios from "../api/axios";
import { useShowPopup } from "../utils/popupHandler";
import RemoveFromCart from "./RemoveFromCart";
const ProductWidget = ({ product, quantity }) => {
  const showPopup = useShowPopup();
  const finalPrice = product.price - product.discount;
  const [newQuantity, setNewQuantity] = React.useState(quantity);

  const handleQuantityChange = (action) => {
    if (action === "add") {
      setNewQuantity((prevQuantity) => prevQuantity + 1);
    } else if (action === "subtract" && quantity > 1) {
      if (newQuantity > 1) {
        setNewQuantity((prevQuantity) => prevQuantity - 1);
      } else {
        setNewQuantity(1);
      }
    }
  };
  const handleQuantitySubmit = async () => {
    try {
      const response = await axios.post("/changeQuantity", {
        productId: product._id,
        quantity: newQuantity,
      });
      showPopup("success", "Item added to cart");
      window.location.reload();
    } catch (error) {
      console.log(error);
      showPopup("error", "Error adding to cart");
    }
  };

  return (
    <div className="flex gap-12 mx-1 my-2 px-2 border-[1px] rounded-xl border-red-500">
      <div className="h-24 w-24">
        <img
          className="h-full w-full object-contain"
          src={product.image}
          alt={product.name}
        />
      </div>
      <div className="w-1/3">
        <div className="text-lg font-semibold">{product.name} </div>
        <div className="text-sm font-medium">{quantity} kg</div>
        <div className="text-lg font-bold">₹{finalPrice * quantity}</div>
      </div>

      <div className="flex flex-col gap-2 py-2">
        <div
          className="minus-icon h-4 w-8 bg-red-500 rounded-lg"
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
          value={newQuantity}
          readOnly
          className="quantity-input border-[0.5vh] border-red-500 w-8 text-center font-bold rounded-xl "
          onChange={(e) => setNewQuantity(e.target.value)}
        />
        <div
          className="plus-icon h-4 w-8 bg-red-500 rounded-lg"
          onClick={() => handleQuantityChange("add")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-full text-white mx-auto"
          >
            <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
          </svg>
        </div>
        {newQuantity != quantity && (
          <button
            onClick={handleQuantitySubmit}
            className="bg-blue-500 text-white font-semibold rounded-md"
          >
            OK
          </button>
        )}
      </div>
      <div>
        <RemoveFromCart product={product} />
      </div>
    </div>
  );
};

ProductWidget.propTypes = {
  product: PropTypes.object.isRequired,
  quantity: PropTypes.number.isRequired,
};

export default ProductWidget;
