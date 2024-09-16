import express from "express";
import {
  addToCart,
  changeQuantity,
  getCartItems,
  removeFromCart,
} from "../controllers/cartController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/addToCart", authenticateToken, addToCart);
router.get("/cartItems", authenticateToken, getCartItems);
router.post("/changeQuantity", authenticateToken, changeQuantity);
router.post("/removeFromCart", authenticateToken, removeFromCart);

export default router;
