import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import OrderDetails from "../components/OrderDetails";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/my-orders");
        console.log(response.data);

        setOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, []);
  return (
    <div>
      <h2 className="font-bold text-xl">My Orders</h2>
      <div>
        {orders?.map((order) => (
          <OrderDetails key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
