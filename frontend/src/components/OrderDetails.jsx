import React from "react";
import PropTypes from "prop-types";
import axios from "../api/axios";
const OrderDetails = ({ order }) => {
  function formatDate(dateString) {
    // Create a new Date object from the input date string
    const date = new Date(dateString);

    // Extract the individual date components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-indexed
    const year = date.getFullYear();

    // Extract the individual time components
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Determine AM/PM
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert 24-hour format to 12-hour format
    hours = hours % 12 || 12; // Convert 0 (midnight) to 12

    // Format minutes and seconds to always be two digits
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    // Return the formatted date and time
    return `${day}/${month}/${year}, ${hours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
  }

  return (
    <div
      className="border-[2px] border-red-500 my-1 rounded-lg p-1 h-32 overflow-hidden"
      key={order._id}
    >
      <h3>
        <span className="font-semibold">Order Date</span> :{" "}
        {formatDate(order.createdAt)}
      </h3>
      <div className="flex justify-around">
        <div>
          <ul className="overflow-scroll w-24 h-28 pb-12 text-sm">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.product.name} {item.quantity}kg
              </li>
            ))}
          </ul>
        </div>
        <div className="flex">
          <section>
            <div>
              <div>Status</div> <div>{order.deliveryStatus}</div>
            </div>
            <div>
              <div>Total Price</div> <div>₹{order.totalPrice}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

OrderDetails.propTypes = {
  order: PropTypes.object.isRequired,
};

export default OrderDetails;
