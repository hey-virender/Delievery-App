import React, { useState } from "react";
import { auth } from "../config/firebase";
import axios from "../api/axios";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";

import { useShowPopup } from "../utils/popupHandler";

const Authenticate = () => {
  const showPopup = useShowPopup();
  const [number, setNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [name, setName] = useState("");

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {},
          "expired-callback": () => {},
        }
      );
    }
  };
  const sendCode = () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    const phoneNumber = countryCode + number;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setIsCodeSent(true);
        showPopup("message", "Verification code sent to your phone number.");
      })
      .catch((error) => {
        console.error("Error sending code", error);
      });
  };

  const verifyCode = () => {
    const credential = PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );

    signInWithCredential(auth, credential)
      .then(async (result) => {
        const idToken = await result.user.getIdToken(true);

        const response = await axios.post("/authenticate", {
          token: idToken,
          name,
        });

        if (response.status == 200) {
          const user = response.data.user;
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("name", user.name);
          localStorage.setItem("phone", user.phone);
          showPopup("message", "Login success");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Error verifying code", error);
        showPopup("error", "Invalid code");
      });
  };

  return (
    <div className="mt-3">
      {!isCodeSent ? (
        <div className="flex flex-col gap-2 bg-red-500 mx-3 h-[60vh] rounded-xl text-white">
          <h2 className="text-center font-semibold text-xl mt-5">
            Sign In with Phone Number
          </h2>
          <input
            className="mx-2 h-12 text-lg py-1 px-2 bg-transparent placeholder:text-white placeholder:font-bold border-2 rounded-xl"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="flex">
            <select
              className="bg-transparent text-white text-lg basis-1 font-bold"
              name="country-code"
              value={countryCode}
              id="country-code"
              onChange={(e) => setCountryCode(e.target.value)}
            >
              <option className="bg-transparent text-black" value="+91">
                +91
              </option>
            </select>
            <input
              className="basis-2 h-12 text-lg py-1 px-1 bg-transparent placeholder:text-white placeholder:font-bold border-2 rounded-xl"
              type="tel"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 w-4/5 mx-auto mt-3 py-3 text-xl font-bold rounded-lg"
            onClick={sendCode}
          >
            Send Code
          </button>
          <div id="recaptcha-container"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 bg-red-500 mx-3 h-[60vh] rounded-xl text-white">
          <h2 className="text-center font-semibold text-xl mt-5">
            Enter Verification Code
          </h2>
          <input
            className="mx-2 h-16 text-lg py-1 px-2 bg-transparent placeholder:text-white placeholder:font-bold border-2 rounded-xl"
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
          />
          <button
            className="bg-green-500 w-4/5 mx-auto mt-3 py-3 text-xl font-bold rounded-lg"
            onClick={verifyCode}
            type="submit
            "
          >
            Verify Code
          </button>
        </div>
      )}
    </div>
  );
};

export default Authenticate;
