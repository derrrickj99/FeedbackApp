const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * User Model for Authentication
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: null
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    refreshToken: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ============================================================================
// INDEXES
// ============================================================================
//userSchema.index({ email: 1 });
//userSchema.index({ createdAt: -1 });

// ============================================================================
// PRE-SAVE MIDDLEWARE - Hash Password
// ============================================================================
userSchema.pre('save', async function (next) {
    // Only hash password if it's modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Update passwordChangedAt field
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) {
        return next();
    }

    this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure token is created after password change
    next();
});

// ============================================================================
// INSTANCE METHODS
// ============================================================================

// Compare password for login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT access token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Generate JWT refresh token
userSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign(
        { id: this._id },
        process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
        { expiresIn: '30d' }
    );

    this.refreshToken = refreshToken;
    return refreshToken;
};

// Check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Update last login
userSchema.methods.updateLastLogin = async function () {
    this.lastLogin = new Date();
    await this.save({ validateBeforeSave: false });
};

// Get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
        avatar: this.avatar,
        isEmailVerified: this.isEmailVerified,
        createdAt: this.createdAt
    };
};

// ============================================================================
// STATIC METHODS
// ============================================================================

// Find user by credentials
userSchema.statics.findByCredentials = async function (email, password) {
    const user = await this.findOne({ email, isActive: true }).select('+password');

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        throw new Error('Invalid email or password');
    }

    return user;
};

// Find active users
userSchema.statics.findActiveUsers = function () {
    return this.find({ isActive: true }).select('-password');
};

// Get user statistics
userSchema.statics.getUserStats = async function () {
    const totalUsers = await this.countDocuments();
    const activeUsers = await this.countDocuments({ isActive: true });
    const adminUsers = await this.countDocuments({ role: 'admin' });
    const verifiedUsers = await this.countDocuments({ isEmailVerified: true });

    return {
        totalUsers,
        activeUsers,
        adminUsers,
        verifiedUsers,
        inactiveUsers: totalUsers - activeUsers
    };
};

module.exports = userSchema;