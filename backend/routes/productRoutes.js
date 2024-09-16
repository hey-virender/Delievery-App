import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductBySection,
  getProductBySearch,
  getProductByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} from "../controllers/productController.js";

const router = express.Router();

// Define the routes for the API

router.get("/products", getAllProducts);
router.get("/products/search", getProductBySearch);
router.get("/products/section/:section", getProductBySection);
router.post("/products/create", createProduct);
router.get("/products/:id", getProductById);
router.put("/products/update/:id", updateProduct);
router.delete("/products/delete/:id", deleteProduct);
router.get("/products/category/:category", getProductByCategory);
router.get("/products/:id/related", getRelatedProducts);

export default router;
