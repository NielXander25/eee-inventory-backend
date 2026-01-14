const express = require('express');
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const protect = require('../middleware/protect');

const router = express.Router();

router.route('/').get(protect, getCategories).post(protect, createCategory);
router.route('/:id').get(protect, getCategory).put(protect, updateCategory).delete(protect, deleteCategory);

module.exports = router;