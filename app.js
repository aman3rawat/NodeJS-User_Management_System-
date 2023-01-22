const express = require('express');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');

const app = express();

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/superAdmin', superAdminRoutes);

module.exports = app;
