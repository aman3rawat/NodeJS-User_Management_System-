const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getUser = catchAsync(async (req, res, next) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new AppError('User Not Found! with the ID', 404));
    }

    res.json({
        status: 'success',
        results: user
    });

});

exports.createUser = catchAsync(async (req, res) => {

    req.body.createdBy = validUser.createdBy;

    const newUser = await User.create(req.body);
    res.status(201).json({
        status: 'sucess',
        data: {
            user: newUser
        }
    });

});

exports.deleteUser = catchAsync(async (req, res, next) => {

    const deletedAdmin = await User.findByIdUpdate(req.params.id, { status: false });

    if (!deletedAdmin) {
        return next(new AppError('User Not Found! with the ID', 404));
    }
    if (req.body.role == "super-admin") {
        return next(new AppError('You are not authorized to perform these role'), 404);
    }

    res.status(204).json({
        status: 'success'
    })

});

exports.updateUser = catchAsync(async (req, res, next) => {

    if (req.body.role == "super-admin") {
        return next(new AppError('You are not authorized to assigned the role of super admin'), 404);
    }

    const user = await User.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true,
            runValidators: true
        })
    res.json({
        status: 'success',
        user
    });

});

exports.getAllUser = catchAsync(async (req, res, next) => {

    let condition = null;

    if (validUser.role == 'admin') {
        condition = { role: { $ne: "super-admin" }, createdBy: validUser._id }
    }

    const users = await User.find({ ...condition }).populate({ path: 'createdBy', select: 'name -_id' });

    res.json({
        status: "sucess",
        data: {
            users
        }
    });
})