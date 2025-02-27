const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const protect = require("../middleware/auth");

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addCart,
    getCart,
    increaseCartQuantity,
    decreaseCartQuantity
} = require('../controllers/productController');

router.post('/add', protect, upload.array('images', 5), createProduct);
router.get('/', protect, getAllProducts);
router.post('/cart', protect, addCart);
router.get('/cart', protect, getCart);
router.put('/cart/:id/increase', protect, increaseCartQuantity);
router.put('/cart/:id/decrease', protect, decreaseCartQuantity);
router.get('/:id', protect, getProductById);
router.put('/:id', protect, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;