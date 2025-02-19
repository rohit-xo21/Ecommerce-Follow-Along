const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const protect = require("../middleware/auth");

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

router.post('/add',protect, upload.array('images',5), createProduct);
router.get('/',protect, getAllProducts);
router.get('/:id', getProductById);
router.put('/:id',protect, updateProduct);
router.delete('/:id',protect, deleteProduct);

module.exports = router;