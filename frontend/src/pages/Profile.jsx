import React, { useEffect, useState } from "react";
import LogoutButton from "../components/LogoutButton";
import ProfileMenu from "../components/ProfileMenu";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/profile");
        setProfile(response.data);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return loading ? (
    <div>Loading</div>
  ) : (
    <div className="relative">
      <LogoutButton />
      <div className="text-lg font-bold text-center">Profile</div>
      <div className="flex flex-col items-center">
        <div className="h-20 w-20 rounded-full overflow-hidden">
          {" "}
          <img
            className="h-full w-full object-contain"
            src={profile.profileImage}
            alt={profile.name}
          />
        </div>
        <div className="mt-2 text-xl font-bold text-gray-800">
          {profile.name}
        </div>
      </div>
      <div className="widget-container text-sm w-[90vw]  h-16 bg-red-500 bg-opacity-25 rounded-lg mx-auto flex justify-around items-center">
        <div
          className="my-orders flex flex-col items-center"
          onClick={() => navigate("/my-orders")}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 mx-auto"
            >
              <path d="M20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM19 20V4H5V20H19ZM8 7H16V9H8V7ZM8 11H16V13H8V11ZM8 15H13V17H8V15Z"></path>
            </svg>
            <span className="">My Orders</span>
          </div>
        </div>
        <div className="Payment" onClick={() => navigate("/cart")}>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 mx-auto"
            >
              <path d="M22.0049 6.99979H23.0049V16.9998H22.0049V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979H21.0049C21.5572 2.99979 22.0049 3.4475 22.0049 3.99979V6.99979ZM20.0049 16.9998H14.0049C11.2435 16.9998 9.00488 14.7612 9.00488 11.9998C9.00488 9.23836 11.2435 6.99979 14.0049 6.99979H20.0049V4.99979H4.00488V18.9998H20.0049V16.9998ZM21.0049 14.9998V8.99979H14.0049C12.348 8.99979 11.0049 10.3429 11.0049 11.9998C11.0049 13.6566 12.348 14.9998 14.0049 14.9998H21.0049ZM14.0049 10.9998H17.0049V12.9998H14.0049V10.9998Z"></path>
            </svg>
            <span className="text-xs">Cart</span>
          </div>
        </div>
        <div
          className="Addresses"
          onClick={() => navigate("/manage-addresses")}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-7 mx-auto"
            >
              <path d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"></path>
            </svg>
            <span className="text-xs">Addresses</span>
          </div>
        </div>
      </div>
      <ProfileMenu />
    </div>
  );
};

export default Profile;
