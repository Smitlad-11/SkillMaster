// server.js - Main entry point for SkillMaster backend
require('express-async-errors');
require("dotenv").config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');


const app = express();

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/lectures', require('./routes/lectureRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/platform-feedback', require('./routes/platformFeedbackRoutes'));
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/queries', require('./routes/queryRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));

// Health check
app.get('/', (req, res) => res.json({ message: 'SkillMaster API is running' }));

// Error handler middleware (must be last)
app.use(require('./middleware/errorMiddleware'))

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`SkillMaster server running on port ${PORT}`));
    } catch (error) {
        console.error('Server failed to start:', error.message);
        process.exit(1);
    }
};

startServer();
