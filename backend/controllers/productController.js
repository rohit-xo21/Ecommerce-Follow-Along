const Product = require('../models/productModel');

// Create a new product
const createProduct = async (req, res) => {
    const { name, description, price, category, stock, images } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !stock || !images) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate price and stock
    if (price < 0 || stock < 0) {
        return res.status(400).json({ message: 'Price and stock must be non-negative' });
    }

    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
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
        res.status(500).json({ message: error.message });
    }
};

// Update a product by ID
const updateProduct = async (req, res) => {
    const { name, description, price, category, stock, images } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !stock || !images) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate price and stock
    if (price < 0 || stock < 0) {
        return res.status(400).json({ message: 'Price and stock must be non-negative' });
    }

    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
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
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};