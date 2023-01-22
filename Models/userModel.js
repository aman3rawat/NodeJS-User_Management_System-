const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user name must be provided'],
        minlength: [3, 'minimum 3 character is allowed'],
        maxlength: [40, 'maximum 40 character is allowed']
    },
    role: {
        type: String,
        enum: ['user', 'super-admin', 'admin']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Email Id must be provided'],
        validate: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password must be provided'],
        minlength: [8, 'Minimum the length of your password is 8'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide confirm password'],
        validate: {
            validator: function (val) {
                return val === this.password;
            },
            message: 'Your Password should match!'
        }
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'userdb'
    },
    status: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.pre('save', async function (next) {

    //only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    //Hash the password with cost 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
});

userSchema.methods.confirmPassword = async function (providePassword, userPassword) {
    return await bcrypt.compare(providePassword, userPassword);
}

const User = mongoose.model('userdb', userSchema);
module.exports = User;
