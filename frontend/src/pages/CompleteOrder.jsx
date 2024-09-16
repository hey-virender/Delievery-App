import React, { useEffect, useState } from "react";
import AddNewAddress from "../components/AddNewAddress";
import axios from "../api/axios";
import AddressBox from "../components/AddressBox";
import { useLocation, useNavigate } from "react-router-dom";
import OrderOverview from "../components/OrderOverview";
import { useShowPopup } from "../utils/popupHandler";

const CompleteOrder = () => {
  const navigate = useNavigate();
  const showPopup = useShowPopup();
  const location = useLocation();
  const { orderType, product, quantity } = location.state || {};
  const [addresses, setAddresses] = useState([]);
  const [cartDetails, setCartDetails] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddAddressBox, setShowAddressBox] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [addressRes, orderRes] = await Promise.all([
          axios.get("/fetchAddresses"),
          orderType === "cart"
            ? axios.get("/cartItems")
            : Promise.resolve(null),
        ]);

        setAddresses(addressRes.data);
        if (orderType === "cart" && orderRes) {
          setCartDetails(orderRes.data);
          const total = orderRes.data.reduce((acc, item) => {
            const effectivePrice =
              item.product.price - (item.product.discount || 0);
            return acc + effectivePrice * item.quantity;
          }, 0);
          setTotalAmount(total);
        } else if (orderType === "single" && product) {
          setTotalAmount((product.price - (product.discount || 0)) * quantity);
        }
      } catch (error) {
        console.error("Error fetching data", error);
        showPopup("error", "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orderType, product, quantity, showPopup]);

  const handleAddressAdded = (newAddress) => {
    setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      showPopup("error", "Razorpay SDK failed to load. Please try again.");
      return;
    }

    try {
      // Use the existing backend endpoints you have for order placement
      const endpoint =
        orderType === "single" ? "/orders/single" : "/orders/cart";

      // Prepare data based on order type
      const data =
        orderType === "single"
          ? {
              productId: product._id,
              quantity,
              deliveryAddressIndex: selectedAddressIndex,
            }
          : { deliveryAddressIndex: selectedAddressIndex };

      // Place the order on the backend and get the response
      const orderResponse = await axios.post(endpoint, data);

      const { amount, razorpayOrderId, currency, user } = orderResponse.data;
      console.log("Order placed:", razorpayOrderId);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount.toString(),
        currency: currency,
        name: "Delivered",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          console.log("Razorpay response:", response);

          // Ensure all parameters are received
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          // Check if all required parameters are available
          if (
            !paymentData.razorpay_order_id ||
            !paymentData.razorpay_payment_id ||
            !paymentData.razorpay_signature
          ) {
            showPopup("error", "Missing payment parameters. Please try again.");
            return;
          }

          try {
            // Call backend to verify the payment
            await axios.post("/verify-razorpay-payment", paymentData);

            showPopup("message", "Payment Successful!");
            navigate("/"); // Navigate to the orders page
          } catch (error) {
            console.error("Payment verification failed", error);
            showPopup(
              "error",
              "Payment verification failed. Please try again."
            );
          }
        },
        prefill: {
          name: user.name,
          phone: user.phone,
        },
        theme: {
          color: "#61dafb",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment initiation failed", error);
      showPopup("error", "Payment initiation failed. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div>Place your order</div>
      <div>Order Details</div>
      <div className="grid grid-cols-2 w-full">
        {orderType === "single" ? (
          <OrderOverview product={product} quantity={quantity} />
        ) : (
          cartDetails.map((item, index) => (
            <OrderOverview
              key={index}
              product={item.product}
              quantity={item.quantity}
            />
          ))
        )}
      </div>

      <div>Choose a delivery address</div>
      <div>
        {addresses.map((address, index) => (
          <AddressBox
            key={index}
            address={address}
            index={index}
            setSelectedAddressIndex={setSelectedAddressIndex}
            selectedAddressIndex={selectedAddressIndex}
          />
        ))}
      </div>

      <button
        onClick={() => setShowAddressBox(!showAddAddressBox)}
        className="bg-blue-500 px-2 py-1 font-semibold text-white rounded-lg"
      >
        Add New Address
      </button>
      {showAddAddressBox && (
        <AddNewAddress onAddressAdded={handleAddressAdded} />
      )}

      <div className="flex gap-24 font-bold">
        <h3>Subtotal</h3>
        <div>₹{totalAmount}</div>
      </div>

      <div>
        <button
          onClick={handleRazorpayPayment}
          className="bg-blue-500  text-white rounded-lg p-1"
        >
          Make Payment
        </button>
      </div>
    </div>
  );
};

export default CompleteOrder;
