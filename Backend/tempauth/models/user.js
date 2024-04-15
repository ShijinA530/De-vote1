const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    ktuid: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: ['CSE', 'EE', 'EC', 'ME', 'CE'] // Add your department options
    },
    year: {
        type: Number,
        required: true,
        min: 2020,
        max: 2023 // Adjust as needed
    }
});

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
