// Check if user is super admin
const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'super_admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied. Super admin only.' });
  }
};

module.exports = isSuperAdmin;