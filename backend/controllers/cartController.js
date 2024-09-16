import Product from "../models/Product.js";
import User from "../models/User.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { product, quantity } = req.body;

    if (quantity == undefined || quantity < 1) {
      res.status(500).json({ error: "Quantity is not valid" });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product is already in the cart
    const cartItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === product._id
    );

    if (cartItemIndex > -1) {
      // If product exists, update the quantity
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      // If product doesn't exist, add the product to the cart
      user.cart.push({ product: product._id, quantity });
    }

    // Save the updated user document
    await user.save();

    const populatedUser = await user.populate({
      path: "cart.product",
      model: "Product",
    });

    res
      .status(200)
      .json({ message: "Cart updated successfully", user: populatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
};

export const getCartItems = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate({
      path: "cart.product",
      model: "Product",
    });
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const changeQuantity = async (req, res) => {
  console.log("changeQuantity");
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;
    if (quantity == undefined || quantity < 1) {
      res.status(500).json({ error: "Quantity is not valid" });
    }
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity = quantity;
      await user.save();
      res.status(200).json({ message: "quantity updated" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const cartItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );
    if (cartItemIndex > -1) {
      user.cart.splice(cartItemIndex, 1);
      await user.save();
      res.status(200).json({ message: "Item removed from cart" });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
