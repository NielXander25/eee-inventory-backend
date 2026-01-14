const express = require('express');
const {
  createCustomer,
  getCustomers,
  getCustomer,
  updateCustomer,
  deleteCustomer,
} = require('../controllers/customerController');
const protect = require('../middleware/protect');

const router = express.Router();

router.route('/').get(protect, getCustomers).post(protect, createCustomer);
router.route('/:id').get(protect, getCustomer).put(protect, updateCustomer).delete(protect, deleteCustomer);

module.exports = router;