require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI);

async function createSuperAdmin() {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@eee.com' });
    
    if (existingAdmin) {
      console.log('Super admin already exists');
      process.exit();
    }
    
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@eee.com',
      password: 'admin123',
      role: 'super_admin'
    });
    
    console.log('Super admin created successfully');
    console.log('Email: admin@eee.com');
    console.log('Password: admin123');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createSuperAdmin();