import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
const CartWidget = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    const fetchCartDetails = async () => {
      const response = await axios.get("/cartItems");
      setCartItems(response.data);

      const total = response.data.reduce((acc, item) => {
        const effectivePrice = item.product.price - item.product.discount; // Subtract discount from price
        const itemTotal = effectivePrice * item.quantity; // Multiply by quantity
        return acc + itemTotal; // Sum the total
      }, 0);

      setTotalAmount(total); // Set the total order value
    };
    fetchCartDetails();
  }, []);

  return (
    cartItems.length > 0 && (
      <div className="fixed bottom-0 w-[95vw] z-50 left-1/2 -translate-x-1/2 h-16 bg-red-500 text-white  duration-1000 ease-in-out px-4 border-2 border-red-500 rounded-t-lg py-1">
        <span>There are items pending in your cart</span>
        <div>
          <span className="font-semibold">Worth ₹{totalAmount}</span>
          <button
            className="bg-blue-500 px-4 rounded-md ml-7 animate-none"
            onClick={() => navigate("/cart")}
          >
            Go to Cart
          </button>
        </div>
      </div>
    )
  );
};

export default CartWidget;
