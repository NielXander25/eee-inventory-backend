const User = require('../models/User');

//  User.create({
//       name: 'Super Admin',
//       email: 'admin@eee.com',
//       password: 'admin123',
//       role: 'super_admin'
//     }).then(user => {
//       console.log('User Created successfully', user)
//     }).catch(err => console.log('Error:', err));
// Create new admin (super admin only)
exports.createAdmin = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all admins (super admin only)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Delete admin (super admin only)
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin || admin.role !== 'admin') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // ❗ Safety: prevent deleting yourself
    if (admin._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete yourself'
      });
    }

    await admin.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
       { name, email },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};