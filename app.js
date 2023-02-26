const { path, express, morgan, helmet, rateLimit, mongoSanitize, xss} = require('./dependencies');

const express = require('express');

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');

const app = express();

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Serving static files 
app.use(express.static(path.join(__dirname, 'public')));

// Set security for HTTP headers
app.use(helmet());

// Limt requests from same API
const limiter = rateLimit({
    max: 10000,  // no of attempt with given no of hours which is intialize in windowMs 
    windowMs: 60 * 60 * 1000, // 1 hour -> within 1 hour there is 100 request possible with same ip
    message: 'Too Many request from these IP, please try again in an hour!'
});

// Data sanitization against NoSql query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/superAdmin', superAdminRoutes);

module.exports = app;
