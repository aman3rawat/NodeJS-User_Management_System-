const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createAdmin = catchAsync(async (req, res) => {
    req.body.createdBy = validUser.createdBy;

    const newAdmin = await User.create(req.body);

    res.status(201).json({
        status: 'sucess',
        data: {
            admin: newAdmin
        }
    });
});

exports.deleteAdmin = catchAsync(async (req, res, next) => {

    const deletedAdmin = await User.findByIdAndUpdate(req.params.id, { status: false });

    if (!deletedAdmin) {
        return next(new AppError('User Not Found! with the ID', 404));
    }

    res.status(204).json({
        status: 'success'
    })
});

exports.updateAdmin = catchAsync(async (req, res) => {

    const user = await User.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true,
            runValidators: true
        })
    res.json({
        status: 'success',
        newAdmin: user
    });

});
