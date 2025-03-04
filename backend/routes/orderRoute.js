const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const { createOrder } = require('../controllers/orderController');

app.use(protect);

router.post('/create', createOrder);

module.exports = router;