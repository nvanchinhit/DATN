// Auth middleware for protecting routes

/**
 * Verify JWT token
 */
exports.verifyToken = (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // In a real implementation, this would verify the JWT token
    // For demo purposes, we're mocking this behavior
    
    // Mock user object that would normally come from token verification
    req.user = {
      id: '123',
      email: 'user@example.com',
      role: 'user'
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }
};

/**
 * Check if user has admin role
 */
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied: Admin role required' 
    });
  }
};