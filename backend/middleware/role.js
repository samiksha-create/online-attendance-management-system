// middleware/role.js
// Restricts route access to specific roles (admin, teacher, student)
// Usage: router.get('/route', protect, authorize('admin', 'teacher'), handler)

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ success: false, message: 'Not authorized, no role found' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not permitted to perform this action`,
      });
    }

    next();
  };
};

module.exports = { authorize };
