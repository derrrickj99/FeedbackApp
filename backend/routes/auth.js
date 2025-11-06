const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/userModel');
const { protect, authorize, loginRateLimit, verifyRefreshToken } = require('../middleware/auth');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// ============================================================================
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ============================================================================
router.post('/register', [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match')
], handleValidationErrors, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("At req route");
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await user.save();
        console.log("After reg route save");
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: user.getPublicProfile(),
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Registration error at here:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

// ============================================================================
// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
// ============================================================================
router.post('/login', loginRateLimit, [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
], handleValidationErrors, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user and include password field
        const user = await User.findByCredentials(email, password);

        // Update last login
        await user.updateLastLogin();

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await user.save();

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: user.getPublicProfile(),
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Login error:', error);

        if (error.message === 'Invalid email or password') {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
});

// ============================================================================
// @route   POST /api/auth/refresh-token
// @desc    Refresh access token
// @access  Public (requires refresh token)
// ============================================================================
router.post('/refresh-token', verifyRefreshToken, async (req, res) => {
    try {
        const user = req.user;

        // Generate new access token
        const accessToken = user.generateAccessToken();

        res.json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                accessToken
            }
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({
            success: false,
            message: 'Token refresh failed',
            error: error.message
        });
    }
});

// ============================================================================
// @route   POST /api/auth/logout
// @desc    Logout user (invalidate refresh token)
// @access  Private
// ============================================================================
router.post('/logout', protect, async (req, res) => {
    try {
        // Clear refresh token
        req.user.refreshToken = undefined;
        await req.user.save();

        res.json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message
        });
    }
});

// ============================================================================
// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
// ============================================================================
router.get('/me', protect, async (req, res) => {
    try {
        res.json({
            success: true,
            data: {
                user: req.user.getPublicProfile()
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: error.message
        });
    }
});

// ============================================================================
// @route   PUT /api/auth/update-profile
// @desc    Update user profile
// @access  Private
// ============================================================================
router.put('/update-profile', protect, [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail()
], handleValidationErrors, async (req, res) => {
    try {
        const { name, email, avatar } = req.body;
        const user = req.user;

        // Check if email is already taken by another user
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }
            user.email = email;
            user.isEmailVerified = false; // Reset verification if email changed
        }

        if (name) user.name = name;
        if (avatar) user.avatar = avatar;

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: user.getPublicProfile()
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

// ============================================================================
// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
// ============================================================================
router.put('/change-password', protect, [
    body('currentPassword')
        .trim()
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .trim()
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.newPassword)
        .withMessage('Passwords do not match')
], handleValidationErrors, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with password field
        const user = await User.findById(req.user._id).select('+password');

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        user.refreshToken = undefined; // Invalidate refresh token
        await user.save();

        // Generate new tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully',
            data: {
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: error.message
        });
    }
});

// ============================================================================
// @route   DELETE /api/auth/delete-account
// @desc    Deactivate user account
// @access  Private
// ============================================================================
router.delete('/delete-account', protect, async (req, res) => {
    try {
        req.user.isActive = false;
        req.user.refreshToken = undefined;
        await req.user.save();

        res.json({
            success: true,
            message: 'Account deactivated successfully'
        });

    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to deactivate account',
            error: error.message
        });
    }
});

// ============================================================================
// ADMIN ROUTES
// ============================================================================

// @route   GET /api/auth/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/users', protect, authorize('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find().select('-password').limit(limit).skip(skip).sort({ createdAt: -1 }),
            User.countDocuments()
        ]);

        res.json({
            success: true,
            data: users,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get users',
            error: error.message
        });
    }
});

// @route   GET /api/auth/stats
// @desc    Get user statistics (Admin only)
// @access  Private/Admin
router.get('/stats', protect, authorize('admin'), async (req, res) => {
    try {
        const stats = await User.getUserStats();

        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get statistics',
            error: error.message
        });
    }
});

module.exports = router;