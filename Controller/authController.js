const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.restrictTo = (...roles) => {

    return async (req, res, next) => {
        if (!roles.includes(req.user.role) || req.user.role == req.body.role || req.body.role == 'super-admin') {
            return next(
                new AppError('You do not have permission to perform this action', 403)
            );
        }
        validUser = req.user;
        next();
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

exports.protect = catchAsync(async (req, res, next) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError('Please logged in again you are logged out', 401)
        );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const validUser = await User.findById(decoded.id);

    if (!validUser) {
        return next(new
            AppError('user belonging to this token not exist', 401
            ));
    }

    validUser.createdBy = decoded.id;
    req.user = validUser;

    next();
})

const sendResponse = function (user, statusCode, res) {
    user.password = undefined;
    const token = createToken(user.id);
    res.status(statusCode).json({
        status: 'success',
        token,
        user
    });
}

exports.signUp = catchAsync(async (req, res, next) => {

    const newUser = await User.create(req.body);

    sendResponse(newUser, 201, res);
})

exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password +status -__v');

    if (!user.status) {
        return next(new AppError('User not found!', 404));
    }

    if (!user || !await user.confirmPassword(password.toString(), user.password)) {
        return next(new AppError('Incorrect email and pasword', 401));
    }

    sendResponse(user, 200, res);
});


