const express = require('express');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const protect = require('../middleware/protect');

const router = express.Router();

router.route('/').get(protect, getOrders).post(protect, createOrder);
router.route('/:id').get(protect, getOrder).delete(protect, deleteOrder);
router.route('/:id/status').put(protect, updateOrderStatus);

module.exports = router;