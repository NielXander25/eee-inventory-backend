const express = require('express');
const { createAdmin, getAllAdmins, deleteAdmin, getProfile, updateProfile } = require('../controllers/userController');
const protect = require('../middleware/protect');
const isSuperAdmin = require('../middleware/isSuperAdmin');

const router = express.Router();

router.post('/admin', protect, isSuperAdmin, createAdmin);
router.get('/admins', protect, isSuperAdmin, getAllAdmins);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/admin/:id', protect, isSuperAdmin, deleteAdmin);


module.exports = router;