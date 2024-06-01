const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');

router.get('/users/:userId', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.post("/orders", orderController.createOrder);

router.post("/verifyPayment", orderController.verifyPayment);

module.exports = router;