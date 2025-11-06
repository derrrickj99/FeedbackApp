const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Protect routes - Verify JWT token
 */
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please login.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key');

            // Check if user still exists
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User no longer exists'
                });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Your account has been deactivated. Please contact support.'
                });
            }

            // Check if user changed password after token was issued
            if (user.changedPasswordAfter(decoded.iat)) {
                return res.status(401).json({
                    success: false,
                    message: 'Password recently changed. Please login again.'
                });
            }

            // Grant access to protected route
            req.user = user;
            next();

        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token. Please login again.'
                });
            }

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Your session has expired. Please login again.'
                });
            }

            throw error;
        }

    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authentication failed',
            error: error.message
        });
    }
};

/**
 * Authorize roles - Check if user has required role
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

/**
 * Optional auth - Continue even if not authenticated
 */
exports.optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key');
                const user = await User.findById(decoded.id);

                if (user && user.isActive) {
                    req.user = user;
                }
            } catch (error) {
                console.log(error);
                console.log('Optional auth: Invalid token, continuing without user');
            }
        }

        next();
    } catch (error) {
        console.error('Optional auth error:', error);
        next();
    }
};

/**
 * Check if user owns the resource
 */
exports.checkOwnership = (resourceField = 'createdBy') => {
    return (req, res, next) => {
        // Admin can access everything
        if (req.user.role === 'admin') {
            return next();
        }

        // Check if resource belongs to user
        const resourceOwnerId = req[resourceField] || req.body[resourceField];

        if (!resourceOwnerId || resourceOwnerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

/**
 * Rate limiting for sensitive routes
 */
exports.loginRateLimit = require('express-rate-limit')({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Verify refresh token
 */
exports.verifyRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        try {
            const decoded = jwt.verify(
                refreshToken,
                process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key'
            );

            const user = await User.findById(decoded.id);

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid refresh token'
                });
            }

            req.user = user;
            next();

        } catch (error) {
            console.log(error)
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }

    } catch (error) {
        console.error('Refresh token verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Token verification failed',
            error: error.message
        });
    }
};