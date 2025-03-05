const express = require('express');
const router = express.Router();

const protect = require('../middleware/auth');

const { createOrder, getUserOrders, cancelOrder } = require('../controllers/orderController');

router.use(protect);

router.post('/create', createOrder);
router.get('/myorders', getUserOrders);
router.put('/cancel/:id', cancelOrder);


module.exports = router;