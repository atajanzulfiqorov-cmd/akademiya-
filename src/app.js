const express = require('express');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');
const reviewRoutes = require('./routes/review.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1', enrollmentRoutes);
app.use('/api/v1', reviewRoutes);
app.use('/api/v1', analyticsRoutes);

module.exports = app;
// src/app.js
const express = require('express');
const path = require('path');
const cors = require('cors'); // <-- Qo'shildi

const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');
const reviewRoutes = require('./routes/review.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

app.use(cors()); // <-- Hamma domenlardan kelayotgan so'rovlarga ruxsat beradi
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1', enrollmentRoutes);
app.use('/api/v1', reviewRoutes);
app.use('/api/v1', analyticsRoutes);

module.exports = app;