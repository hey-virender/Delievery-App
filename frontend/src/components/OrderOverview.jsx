import React from "react";
import PropTypes from "prop-types";
const OrderOverview = ({ product, quantity }) => {
  return (
    <div className="flex items-center col-span-1 gap-2 w-44 border-[2px] border-blue-500 rounded-lg p-1">
      <div className="h-20 w-20">
        <img
          className="h-full w-full object-contain"
          src={product.image}
          alt={product.name}
        />
      </div>
      <div>
        <div className="text-sm">{product.name}</div>
        <div className="text-sm">({quantity} kg)</div>
        <div className="font-semibold">
          ₹ {(product.price - product.discount) * quantity}
        </div>
      </div>
    </div>
  );
};

OrderOverview.propTypes = {
  product: PropTypes.object.isRequired,
  quantity: PropTypes.number.isRequired,
};

export default OrderOverview;
