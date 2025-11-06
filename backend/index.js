const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require("./routes/auth");
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/feedback-app')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

app.use("/api/auth", authRoutes);
// Import Routes
const formRoutes = require('./routes/forms');
//const feedbackRoutes = require('./routes/feedback');

// Use Routes
app.use('/api/forms', formRoutes);
//app.use('/api/feedback', feedbackRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Feedback App API is running! 🚀',
        endpoints: {
            forms: '/api/forms',
            feedback: '/api/feedback'
        }
    });
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    //console.error(err);
    res.status(500).json({
        message: 'Something went wrong!',
        error: 'Internal server error'
    });
});

// Handle 404
app.use('/*splat', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
});