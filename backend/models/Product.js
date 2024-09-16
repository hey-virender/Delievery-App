import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 250,
    minlength: 5,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  available: {
    type: Boolean,
    default: true,
  },
  metricUnit: {
    type: String,
    // required: true,
    enum: ["kg", "g", "l", "ml", "packet"],
  },
  section: {
    type: String,
    required: true,
    enum: ["grocery", "vegetables"],
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
});

// Search functionality for products
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;
