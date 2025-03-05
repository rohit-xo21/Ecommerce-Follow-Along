const express = require('express');
const router = express.Router();

const protect = require('../middleware/auth');

const { createOrder, getUserOrders } = require('../controllers/orderController');

router.use(protect);

router.post('/create', createOrder);
router.get('/myorders', getUserOrders);


module.exports = router;