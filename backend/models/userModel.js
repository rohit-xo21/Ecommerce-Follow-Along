const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            'Please enter a valid email address',
        ],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [4, "Password should be greater than 4 characters"],
        select: false,
        validate: {
            validator: validatePassword, 
            message:'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character'
        }
    },
    phone: {
        type: Number
    },
    address: [
        {
            country: {
                type: String,
            },
            city:{
                type: String,
            },
            address1:{
                type: String,
            },
            address2:{
                type: String,
            },
            zipCode:{
                type: Number,
            },
            addressType:{
                type: String,
            },
    }
    ],
    role: {
        type: String,
        default: 'user',
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },

    
});

function validatePassword(password) {
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*<>,.:;"']/.test(password);
}

module.exports = mongoose.model('User', userSchema);