import Razorpay from "razorpay"; // Add Razorpay import
import User from "../models/User.js"; // Add User
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import crypto from "crypto";
import mongoose from "mongoose";

// Create a Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Use your Razorpay key_id
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Use your Razorpay key_secret
});

export const placeSingleProductOrder = async (req, res) => {
  try {
    const { productId, quantity, deliveryAddressIndex } = req.body;
    const customer = req.userId;

    // Fetch user data
    const user = await User.findById(customer);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the address index is valid
    if (!user.addresses[deliveryAddressIndex]) {
      return res.status(400).json({ message: "Invalid delivery address" });
    }

    const address = user.addresses[deliveryAddressIndex];

    // Fetch product details
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Ensure quantity is valid
    if (quantity <= 0)
      return res.status(400).json({ message: "Invalid quantity" });

    // Calculate total price
    const totalPrice = product.price * quantity;

    // Step 1: Create a Razorpay order (wrapped in try-catch)
    let razorpayOrder;
    try {
      const razorpayOptions = {
        amount: totalPrice * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      };
      razorpayOrder = await razorpayInstance.orders.create(razorpayOptions);
    } catch (error) {
      return res.status(500).json({
        message: "Razorpay order creation failed",
        error: error.message,
      });
    }

    // Step 2: Create and save the order in your database
    const order = new Order({
      items: [{ product: productId, quantity }],
      totalPrice,
      customer,
      deliveryAddress: address,
      status: "Pending",
      razorpayOrderId: razorpayOrder.id, // Store the Razorpay order ID for tracking
    });

    // Add order reference to the user
    user.orders.push(order._id);

    // Save order and user in a transaction (optional, but recommended for atomicity)
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await user.save({ session });
      await order.save({ session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      return res
        .status(500)
        .json({ message: "Failed to save order", error: error.message });
    } finally {
      session.endSession();
    }

    // Step 3: Send both backend order details and Razorpay order details
    res.status(201).json({
      order,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      user: {
        name: user.name,
        contact: user.phone, // Consider if phone number needs to be returned
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Place Order for Cart Items
export const placeCartOrder = async (req, res) => {
  try {
    const { deliveryAddressIndex } = req.body;

    // Find the user and their cart
    const userId = req.userId;
    const user = await User.findById(userId).populate("cart.product");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if the delivery address index is valid
    const deliveryAddress = user.addresses[deliveryAddressIndex];
    if (!deliveryAddress) {
      return res.status(400).json({ message: "Invalid delivery address" });
    }

    // Check if the cart is empty
    if (user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Prepare order details
    const items = user.cart.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
    }));

    // Calculate total price and validate product prices
    const totalPrice = user.cart.reduce((acc, item) => {
      const productPrice = item.product.price || 0; // Fallback to 0 if price is undefined
      return acc + productPrice * item.quantity;
    }, 0);

    // Step 1: Create a Razorpay order (wrapped in try-catch)
    let razorpayOrder;
    try {
      const razorpayOptions = {
        amount: totalPrice * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      };
      razorpayOrder = await razorpayInstance.orders.create(razorpayOptions);
    } catch (error) {
      return res.status(500).json({
        message: "Razorpay order creation failed",
        error: error.message,
      });
    }

    // Step 2: Create and save the order in your database
    const order = new Order({
      items,
      totalPrice,
      customer: userId,
      deliveryAddress,
      status: "Pending",
      razorpayOrderId: razorpayOrder.id, // Store the Razorpay order ID for tracking
    });

    // Use a transaction for order creation and cart clearing
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await order.save({ session });
      user.orders.push(order._id);
      user.cart = [];
      await user.save({ session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      return res
        .status(500)
        .json({ message: "Failed to process order", error: error.message });
    } finally {
      session.endSession();
    }

    // Step 4: Send both backend order details and Razorpay order details
    res.status(201).json({
      order,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      user: {
        name: user.name,
        contact: user.phone, // Be cautious about including sensitive information
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    // Find and update the order
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    // Validate action
    const validActions = ["Delivered", "Cancelled"];
    if (!validActions.includes(action))
      return res.status(400).json({ message: "Invalid action" });

    // Update order status
    const updateData = { status: action };
    if (action === "Delivered") updateData.deliveredAt = new Date();
    const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Check if the required parameters are provided
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.log("missing required parameters");
      return res
        .status(400)
        .send({ success: false, message: "Missing parameters" });
    }

    // Construct the expected signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Log both signatures for debugging
    console.log("Generated Signature:", generatedSignature);
    console.log("Received Signature:", razorpay_signature);

    // Verify the signature
    if (generatedSignature === razorpay_signature) {
      // Find the order and update its status
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

      if (!order) {
        console.log("Order not found");
        return res
          .status(404)
          .send({ success: false, message: "Order not found" });
      }

      order.status = "success"; // Or any other status you want to set
      await order.save();

      return res
        .status(200)
        .send({ success: true, message: "Payment verified successfully" });
    } else {
      return res
        .status(400)
        .send({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment", error);
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

export const myOrders = async (req, res) => {
  console.log("my orders called ");
  try {
    const userId = req.userId;
    const orders = await Order.find({ customer: userId })
      .populate("items.product")
      .sort({ createdAt: -1 })
      .exec();
    if (orders.length < 1) {
      return res.status(404).json({ message: "No orders found" });
    }
    console.log(orders);
    return res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching order data" });
  }
};
