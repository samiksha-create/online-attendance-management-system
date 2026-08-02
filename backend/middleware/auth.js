// middleware/auth.js
// Verifies JWT token from Authorization header and attaches user payload to req.user

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      // Extract token: "Bearer <token>"
      token = authHeader.split(' ')[1];

      // Verify token using secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach decoded payload (id, role) to request object
      req.user = decoded;

      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
