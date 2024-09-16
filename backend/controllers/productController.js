import Product from "../models/Product.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

export const getProductBySection = async (req, res) => {
  
  try {
    const { section } = req.params;
    const products = await Product.find({ section });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

export const getProductById = async (req, res) => {
  
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true, // Returns the updated document
    });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

export const getProductBySearch = async (req, res) => {

  try {
    const { query } = req.query;
    

    // Check if a query is provided
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Perform search using the $text index
    const products = await Product.find({
      $text: { $search: query },
    });

    // If products are found, send them back
    if (products.length > 0) {
      return res.status(200).json(products);
    } else {
      // No products found for the search
      return res
        .status(404)
        .json({ message: "No products found matching the search query" });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error("Search error: ", error);
    return res.status(500).json({ error: error.message });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the selected product by ID
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Find related products in the same category and subcategory, excluding the current product
    const relatedProducts = await Product.find({
      _id: { $ne: id }, // Exclude the current product
      category: product.category,
    });

    if (relatedProducts.length > 0) {
      res.status(200).json(relatedProducts);
    } else {
      res.status(404).json({ message: "No related products found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};
