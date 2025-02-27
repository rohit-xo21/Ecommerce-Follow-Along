const Product = require('../models/productModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const cloudinary = require("../config/cloudinary");

// Helper function to upload images
const uploadImages = async (files) => {
  const uploadResults = [];
  for (let i = 0; i < files.length; i++) {
    const result = await cloudinary.uploader.upload(files[i].path);
    uploadResults.push(result.secure_url);
  }
  return uploadResults;
};

// Create a new product
const createProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;

  // Check if images are uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No images uploaded' });
  }

  const uploadResults = await uploadImages(req.files);

  // Validate required fields
  if (!name || !description || !price || !category || !stock || !uploadResults) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate price and stock
  if (price < 0 || stock < 0) {
    return res.status(400).json({ message: 'Price and stock must be non-negative' });
  }

  try {
    const product = new Product({ ...req.body, email: req.user.email, images: uploadResults });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ email: req.user.email });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;

  let uploadResults = [];

  // Upload new images if provided
  if (req.files && req.files.length > 0) {
    uploadResults = await uploadImages(req.files);
  }

  // Validate required fields
  if (!name || !description || !price || !category || !stock) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate price and stock
  if (price < 0 || stock < 0) {
    return res.status(400).json({ message: 'Price and stock must be non-negative' });
  }

  try {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Keep old images if no new ones are uploaded
    const updatedImages = uploadResults.length > 0 ? uploadResults : existingProduct.images;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, images: updatedImages },
      { new: true, runValidators: true }
    );

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const addCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const email = req.user.email;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {

      return res.status(400).json({ message: "Invalid productId" });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId).catch(err => {
        console.error("Error finding product:", err);
        return null;
    });

    if (!product ) {

      return res.status(404).json({ message: "Product not found" });
    }

    const cartItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (cartItemIndex > -1) {
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getCart = async (req, res) => {
  try {
    console.log("User:", req.user);
    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: "User not authenticated or email missing" });
    }
    
    const email = req.user.email;
    
    const user = await User.findOne({ email });

    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.cart && user.cart.length > 0) {
      try {
        await user.populate({
          path: "cart.productId",
          model: "Product"
        });
      } catch (populateErr) {
        console.error("Error populating cart products:", populateErr);
      }
    }
    
    res.status(200).json({
      message: "Cart retrieved successfully",
      cart: user.cart,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};


const increaseCartQuantity = async (req, res) => {
  try {
    const productId = req.params.id;
    const email = req.user.email;


    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const cartItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }


    user.cart[cartItemIndex].quantity += 1;
    await user.save();


    await user.populate({
      path: "cart.productId",
      model: "Product"
    });

    res.status(200).json({
      message: "Quantity increased successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error increasing quantity:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


const decreaseCartQuantity = async (req, res) => {
  try {
    const productId = req.params.id;
    const email = req.user.email;


    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const cartItemIndex = user.cart.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (cartItemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (user.cart[cartItemIndex].quantity > 1) {
      user.cart[cartItemIndex].quantity -= 1;
    } else {

      user.cart.splice(cartItemIndex, 1);
    }

    await user.save();

    await user.populate({
      path: "cart.productId",
      model: "Product"
    });

    res.status(200).json({
      message: "Quantity decreased successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error("Error decreasing quantity:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addCart,
  getCart,
  increaseCartQuantity,
  decreaseCartQuantity
};