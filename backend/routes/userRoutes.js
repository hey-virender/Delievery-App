import express from "express";
import {
  authenticateToken,
  refreshToken,
} from "../middlewares/authMiddleware.js";
import {
  addNewAddress,
  authenticate,
  deleteAddress,
  fetchAddresses,
  getProfile,
  logout,
} from "../controllers/userController.js";

const router = express.Router();

// Route for authentication
router.post("/authenticate", authenticate);

// Route for refreshing access token
router.post("/refresh-token", refreshToken);

// Protected route example
router.get("/profile", authenticateToken, getProfile);

router.post("/addNewAddress", authenticateToken, addNewAddress);

router.get("/fetchAddresses", authenticateToken, fetchAddresses);

router.delete("/deleteAddress", authenticateToken, deleteAddress);

router.post("/logout", logout);

export default router;
