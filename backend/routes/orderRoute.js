const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const { createOrder, getUserOrders } = require('../controllers/orderController');

app.use(protect);

router.post('/create', createOrder);
router.get('/myorders', getUserOrders);


module.exports = router;