import React from "react";
import PropTypes from "prop-types";
const AddressBox = ({
  address,
  index,
  setSelectedAddressIndex,
  selectedAddressIndex,
}) => {
  return (
    <div
      className={`grid grid-cols-3 gap-x-3  rounded-xl p-4 text-white font-semibold capitalize my-1 ${
        selectedAddressIndex == index ? " bg-blue-600" : "bg-slate-700"
      }`}
      onClick={() => {
        console.log(index);
        setSelectedAddressIndex(index);
      }}
    >
      <h3 className="col-span-3 text-white font-bold text-xl">{`Address ${
        index + 1
      }`}</h3>

      <div className="col-span-3">{address.line1}</div>
      <div className="col-span-3">{address.line2}</div>
      <div>{address.city}</div>
      <div className="col-span-2">{address.state}</div>
      <div>{address.country}</div>
      <div className="col-span-2">{address.pinCode}</div>
    </div>
  );
};

AddressBox.propTypes = {
  address: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  setSelectedAddressIndex: PropTypes.func,
  selectedAddressIndex: PropTypes.number,
};

export default AddressBox;
