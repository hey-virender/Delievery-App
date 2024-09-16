import React, { useState } from "react";
import axios from "../api/axios";
import PropTypes from "prop-types";

const AddNewAddress = ({ onAddressAdded }) => {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pinCode, setPinCode] = useState("");

  const handleAddNewAddress = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    if (!line1 || !city || !state || !country || !pinCode) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await axios.post("/addNewAddress", {
        line1,
        line2,
        city,
        state,
        country,
        pinCode,
      });

      // Call the callback function to pass the new address to the parent component
      onAddressAdded(response.data);

      // Optionally, clear the input fields after successful submission
      setLine1("");
      setLine2("");
      setCity("");
      setState("");
      setCountry("");
      setPinCode("");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <h2>Enter details</h2>
      <form
        className="grid gap-x-2 gap-y-3 grid-cols-2"
        onSubmit={handleAddNewAddress}
      >
        <label className="col-span-2 w-full">
          Line 1: (Required)
          <input
            type="text"
            className="col-span-2 w-full border-[1px] border-blue-500 rounded-lg"
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
          />
        </label>
        <label className="col-span-2 w-full">
          Line 2:
          <input
            type="text"
            className="col-span-2 w-full border-[1px] border-blue-500 rounded-lg "
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
          />
        </label>
        <label className="col-span-1 w-full">
          City:
          <input
            type="text"
            className="col-span-1 w-full border-[1px] border-blue-500 rounded-lg "
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
        <label className="col-span-1 w-full">
          State:
          <input
            type="text"
            className="col-span-1 w-full border-[1px] border-blue-500 rounded-lg "
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>
        <label className="col-span-1 w-full">
          Country:
          <input
            type="text"
            className="col-span-1 w-full border-[1px] border-blue-500 rounded-lg "
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>
        <label className="col-span-1 w-full">
          Pin Code:
          <input
            type="text"
            className="col-span-1 w-full border-[1px] border-blue-500 rounded-lg "
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
          />
        </label>
        <button
          className="bg-blue-400 rounded-lg text-white font-medium border-[1px] border-gray-500 col-span-2"
          type="submit"
        >
          Add Address
        </button>
      </form>
    </div>
  );
};
AddNewAddress.propTypes = {
  onAddressAdded: PropTypes.func.isRequired, // Prop type for the callback function
};
export default AddNewAddress;
