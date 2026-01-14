const express = require('express');
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const protect = require('../middleware/protect');

const router = express.Router();

router.route('/').get(protect, getProducts).post(protect, createProduct);
router.route('/:id').get(protect, getProduct).put(protect, updateProduct).delete(protect, deleteProduct);

module.exports = router;