import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
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
    match: /^[1-9]{1}[0-9]{5}$/,
  },
  default: {
    type: Boolean,
    default: false,
  },
});

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, unique: true, required: true },
  firebaseId: { type: String, unique: true, required: true },
  addresses: [addressSchema],
  profileImage: {
    type: String,
    default:
      "https://www.pngall.com/wp-content/uploads/15/Cartoon-Cat-PNG-Clipart-300x225.png",
  },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
