import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import AddressBox from "../components/AddressBox";
import AddNewAddress from "../components/AddNewAddress";
import { useShowPopup } from "../utils/popupHandler";
const ManageAddresses = () => {
  const showPopup = useShowPopup();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState();
  const [showAddAddress, setShowAddAddress] = useState(false);
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("/fetchAddresses");
        setAddresses(response.data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchAddresses();
  }, []);
  const handleAddressAdded = (newAddress) => {
    setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
  };
  const handleAddressDelete = async () => {
    try {
      const response = await axios.delete(
        `/deleteAddress?addressIndex=${selectedAddressIndex}`
      );
      showPopup("message", response.data.message);
    } catch (e) {
      console.log(e);
      showPopup("error", "Failed to delete address");
    }
  };
  return (
    <div>
      <div className="flex justify-between">
        <h2>Saved Addresses</h2>
        {selectedAddressIndex != null ? (
          <button
            className="bg-red-500 text-white font-medium p-1 rounded-sm"
            onClick={handleAddressDelete}
          >
            Delete
          </button>
        ) : null}
      </div>
      <div>
        <div>
          <button
            className="bg-blue-600 text-white px-2 py-1 font-semibold"
            onClick={() => setShowAddAddress(!showAddAddress)}
          >
            Add New Address
          </button>
        </div>
        {showAddAddress && (
          <div className="absolute bg-white">
            <div className="bg-blue-500 h-[2px] mt-3"></div>
            <AddNewAddress onAddressAdded={handleAddressAdded} />
          </div>
        )}
      </div>
      <div className="overflow-y-scroll">
        {addresses.map((address, index) => (
          <AddressBox
            key={index}
            address={address}
            index={index}
            selectedAddressIndex={selectedAddressIndex}
            setSelectedAddressIndex={setSelectedAddressIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default ManageAddresses;
