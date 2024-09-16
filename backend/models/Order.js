import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, default: 1 },
});

const orderSchema = mongoose.Schema({
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  deliveryAddress: {
    line1: {
      type: String,
      required: true,
    },
    line2: {
      type: String,
    },
    city: {
      type: String,
      required: true,
      lowercase: true,
    },
    state: {
      type: String,
      required: true,
      lowercase: true,
    },
    country: {
      type: String,
      required: true,
      lowercase: true,
    },
    pinCode: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  deliveryStatus: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    lowercase: true,
    default: "Prepaid",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "sailed", "success"],
    default: "pending",
  },
  razorpayOrderId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expectedDelivery: { type: Date },
  deliveredAt: { type: Date },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
