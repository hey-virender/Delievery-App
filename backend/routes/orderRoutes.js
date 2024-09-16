import express from "express";
import {
  placeSingleProductOrder,
  placeCartOrder,
  updateOrderStatus,
  markOrderStatus,
  verifyRazorpayPayment,
  myOrders,
} from "../controllers/orderController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/my-orders", authenticateToken, myOrders);
router.post("/orders/single", authenticateToken, placeSingleProductOrder);
router.post("/orders/cart", authenticateToken, placeCartOrder);
router.put("/orders/:id/status", updateOrderStatus);
router.put("/orders/:id/mark", markOrderStatus);
router.post(
  "/verify-razorpay-payment",
  authenticateToken,
  verifyRazorpayPayment
);

export default router;
