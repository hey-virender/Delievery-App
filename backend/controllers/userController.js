import { admin } from "../config/firebase.js"; // Import Firebase Admin
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils.js";

export const authenticate = async (req, res) => {
  const { token, name } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, phone_number } = decodedToken;

    if (!phone_number) {
      return res
        .status(400)
        .json({ error: "Phone number is missing from the token" });
    }

    let user = await User.findOne({ firebaseId: uid });
    if (user) {
      const accessToken = generateAccessToken(user._id, user.phone);
      const refreshToken = generateRefreshToken(user._id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 604800000, // 7 days
      });
      res.json({ accessToken, message: "User verified successfully", user });
    } else {
      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }
      user = new User({
        name,
        phone: phone_number,
        firebaseId: uid,
      });

      await user.save();
      const accessToken = generateAccessToken(user._id, user.phone);
      const refreshToken = generateRefreshToken(user._id);

      // Set cookies for refresh token and send access token in response
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 604800000, // 7 days
      });
      res.json({
        accessToken,
        message: "User verified and stored successfully",
        user,
      });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ error: "Failed to verify token or store user" });
  }
};

export const getProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("-_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("refreshToken", "");
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    res.status(500).json({ error: "Failed to log out" });
  }
};

export const addNewAddress = async (req, res) => {
  const { line1, line2, city, state, country, pinCode } = req.body;
  const address = {
    line1,
    line2,
    city,
    state,
    country,
    pinCode,
  };
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.addresses.push(address);
    await user.save();

    res.status(200).json({ message: "Address added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add new address" });
  }
};

export const fetchAddresses = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).select("addresses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.addresses);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
};

export const deleteAddress = async (req, res) => {
  console.log("deleteAddress");
  try {
    const userId = req.userId;
    const { addressIndex } = req.query;

    // Check if addressIndex is provided and is a valid number
    if (typeof addressIndex !== "number" || addressIndex < 0) {
      return res.status(400).json({ message: "Invalid address index" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the addressIndex exists in the user's addresses array
    if (addressIndex >= user.addresses.length) {
      return res.status(400).json({ message: "Address index out of bounds" });
    }

    // Remove the address at the specified index
    user.addresses.splice(addressIndex, 1);
    await user.save();

    // Respond with success
    console.log(user.addresses);
    res.status(200).json({
      message: "Address deleted successfully",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ error: "Failed to delete address" });
  }
};
