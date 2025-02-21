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
    getCart
} = require('../controllers/productController');

router.post('/add',protect, upload.array('images',5), createProduct);
router.get('/',protect, getAllProducts);

router.get('/:id',protect, getProductById);
router.put('/:id',protect, upload.array('images',5), updateProduct);
router.delete('/:id',protect, deleteProduct);
router.post('/cart',protect, addCart);
router.get('/cart',protect, getCart);



module.exports = router;